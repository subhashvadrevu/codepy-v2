import jwt from "jsonwebtoken";
import  { db } from "../libs/db.js";

export const authMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({
                message: "Unauthorized Access - No token provided"
            })
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized Access - Invalid token"
            })
        }

        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                name: true, 
                email: true,
                username: true,
                role: true,
                isVerified: true,
            }
        });

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error authenticating user"
        })
    }
};

export const checkAdmin = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                role: true
            }
        })

        if(!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied"
            })
        }

        next();

    } catch (error) {
        console.log("Admin check : ",error);
        return res.status(500).json({
            error: "Error checking user role"
        })
    }
}


export const isEmailVerified = async(req, res, next) => {
    const id = req.user.id;
    try {
        const user = await db.user.findUnique({
            where: {
                id
            }, 
            select: {
                isVerified: true
            }
        });

        if(!user || !user.isVerified) {
            return res.status(403).json({
                error: "Access Denied, Verify your email first!"
            });
        }

        next();
        
    } catch (error) {
        console.log("email verify status check : ", error);
        return res.status(500).json({
            error: "Error checking user verification status"
        });
    }
};