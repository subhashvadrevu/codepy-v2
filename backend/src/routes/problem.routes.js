import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middlewares.js";
import { createProblem, deleteProblem, getAllProblems, getProblemById, getSolvedProblemsByUser, updateProblem } from "../controllers/problem.controllers.js";

const problemRoutes = express.Router();


problemRoutes.post("/createProblem", authMiddleware, checkAdmin, createProblem);

problemRoutes.get("/getAllProblems", authMiddleware, getAllProblems);

problemRoutes.get("/getProblem/:id", authMiddleware, getProblemById);

problemRoutes.patch("/updateProblem/:id", authMiddleware, checkAdmin, updateProblem);

problemRoutes.delete("/deleteProblem/:id", authMiddleware, checkAdmin, deleteProblem);

problemRoutes.get("/getSolvedProblems", authMiddleware, getSolvedProblemsByUser);


export default problemRoutes;