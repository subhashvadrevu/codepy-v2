import express from "express";
import { deleteAccount, generate, login, logout, me, register, verify } from "../controllers/auth.controllers.js";
import { authMiddleware, isEmailVerified } from "../middlewares/auth.middlewares.js";


const authRoutes = express.Router();


authRoutes.post("/register", register);

authRoutes.patch("/generateOtp", authMiddleware, generate);

authRoutes.post("/verifyOtp", authMiddleware, verify);

authRoutes.post("/login", login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/me", authMiddleware, isEmailVerified, me);

authRoutes.delete("/delete", authMiddleware, deleteAccount);


export default authRoutes;