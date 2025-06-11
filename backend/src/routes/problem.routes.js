import express from "express";
import { authMiddleware, checkAdmin, isEmailVerified } from "../middlewares/auth.middlewares.js";
import { createProblem, deleteProblem, getAllProblems, getProblemById, getSolvedProblemsByUser, updateProblem } from "../controllers/problem.controllers.js";

const problemRoutes = express.Router();


problemRoutes.post("/createProblem", authMiddleware, isEmailVerified, checkAdmin, createProblem);

problemRoutes.get("/getAllProblems", authMiddleware, isEmailVerified, getAllProblems);

problemRoutes.get("/getProblem/:id", authMiddleware, isEmailVerified, getProblemById);

problemRoutes.patch("/updateProblem/:id", authMiddleware, isEmailVerified, checkAdmin, updateProblem);

problemRoutes.delete("/deleteProblem/:id", authMiddleware, isEmailVerified, checkAdmin, deleteProblem);

problemRoutes.get("/getSolvedProblems", authMiddleware, isEmailVerified, getSolvedProblemsByUser);


export default problemRoutes;