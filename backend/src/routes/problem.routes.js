import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middlewares.js";
import { createProblem, deleteProblem, getAllProblems, getProblemByName, getSolvedProblemsByUser, updateProblem } from "../controllers/problem.controllers.js";

const problemRoutes = express.Router();


problemRoutes.post("/createProblem", authMiddleware, checkAdmin, createProblem);

problemRoutes.get("/getAllProblems", authMiddleware, getAllProblems);

problemRoutes.get("/getProblem/:name", authMiddleware, getProblemByName);

problemRoutes.patch("/updateProblem/:name", authMiddleware, checkAdmin, updateProblem);

problemRoutes.delete("/deleteProblem/:name", authMiddleware, checkAdmin, deleteProblem);

problemRoutes.get("/getSolvedProblems", authMiddleware, getSolvedProblemsByUser);


export default problemRoutes;