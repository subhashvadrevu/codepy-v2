import express from "express";
import { deleteAccount, login, logout, me, register } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";


const authRoutes = express.Router();


authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/me", authMiddleware, me);

authRoutes.delete("/delete", authMiddleware, deleteAccount);


export default authRoutes;