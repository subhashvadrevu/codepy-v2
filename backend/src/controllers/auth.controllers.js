import bcrypt from "bcryptjs";
import { db } from "../libs/db.js"
import jwt from "jsonwebtoken";
import { sendEmail } from "../utilities/email.utility.js";


export const register = async(req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if(existingUser) {
            return res.status(400).json({
                error: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                username: email.split("@")[0],
                password: hashedPassword,
                name,
                role: "USER"
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })


        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser?.image
            }
        });


    } catch (error) {
        console.log("Error creating user: ", error);
        return res.status(500).json({
            error: "Error creating user"
        });
    }
};


export const generate = async(req, res) => {
    const userId = req.user.id;
  
    try {

        const alreadyVerified = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                isVerified: true
            }
        });

        if(alreadyVerified.isVerified) {
            return res.status(400).json({
                error: "User already verified"
            });
        }


        const existingOtpRequest = await db.userOtpVerification.findUnique({
            where: {
                userId
            }
        });


        if(existingOtpRequest && existingOtpRequest.expiresAt > new Date()) {
            return res.status(400).json({
                error: "Your previous otp is still active"
            });
        }


        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        if(!newOtp) {
            return res.status(400).json({
                error: "Error generating otp, try again after 15 min..."
            });
        }

        const newOtpRequest = await db.userOtpVerification.upsert({
            where: {
                userId
            },
            update: {
                otp: newOtp,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            },
            create: {
                userId, 
                otp: newOtp,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        if(!newOtpRequest) {
            return res.status(400).json({
                error: "Error generating otp, try again after 15 min..."
            });
        }

        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                email: true,
                name: true,
            }
        });

        if(!user || !user?.email) {
            return res.status(400).json({
                error: "Error fetching email, try again..."
            });
        }

        const emailResponse = await sendEmail(user?.email, newOtp, user?.name);

        if(!emailResponse) {
            return res.status(400).json({
                error: "Error sending email"
            });
        }

        return res.status(200).json({
            success: true, 
            message: "Otp sent successfully",
        });

    } catch (error) {
        console.log("otp generation error: ", error);
        return res.status(500).json({
            error: "Error generating otp, Try after sometime..."
        });
    }
};


export const verify = async(req, res) => {
    const { otp } = req.body;
    const userId = req.user.id;

    try {
        const verifyOtp = await db.userOtpVerification.findUnique({
            where: {
                userId,
            }
        })

        if(verifyOtp.otp != otp) {
            return res.status(400).json({
                error: "Invalid OTP"
            });
        }

        if(verifyOtp.expiresAt < new Date()) {
            return res.status(400).json({
                error: "OTP expired"
            });
        }

        await db.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: true,
            }
        });

        await db.userOtpVerification.update({
            where: {
                userId
            },
            data: {
                expiresAt: new Date(Date.now())
            }
        });

        return res.status(200).json({
            success: true,
            message: "Email verification successful"
        });

    } catch (error) {
        console.log("otp verification error: ", error);
        return res.status(500).json({
            error: "Error verifying otp, Try after sometime..."
        });
    }
};


export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });

        if(!existingUser) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordMatch) {
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token,  {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "User login sucessful",
            user: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role,
                image: existingUser?.image,
                isVerified: existingUser.isVerified,
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error
        })
    }
};

export const logout = async(req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        return res.status(200).json({
            success: true,
            message: "User logout successful",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error in logout, please try again..."
        })
    }
};

export const me = async(req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error fetching user details"
        })
    }
};

export const deleteAccount = async(req, res) => {
    const id = req.user.id;

    try {
        const user = await db.user.findUnique({
            where: {
                id
            }
        });

        if(!user) {
            return res.status(500).json({
                error: "Error deleting account"
            });
        }

        const deletedAccount = await db.user.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Account deletion successful",
            deletedAccount
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error deleting account"
        });
    }
};