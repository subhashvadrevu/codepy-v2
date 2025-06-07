import bcrypt from "bcryptjs";
import { db } from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";


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
                role: UserRole.USER
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })


        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "None",
            secure: process.env.NODE_ENV !== "development",
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
            sameSite: "None",
            secure: process.env.NODE_ENV !== "development",
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
                image: existingUser?.image
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error in login, please try again..."
        })
    }
};

export const logout = async(req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
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