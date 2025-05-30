import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { getAllSubmissions, getSubmissions, getSubmissionsCount, submitCode } from "../controllers/submission.controllers.js";

const submissionRoutes = express.Router();

submissionRoutes.post("/", authMiddleware, submitCode);

submissionRoutes.get("/getAllSubmissions", authMiddleware, getAllSubmissions);

submissionRoutes.get("/getSubmissions/:id", authMiddleware, getSubmissions);

submissionRoutes.get("/getSubmissionCount/:id", authMiddleware, getSubmissionsCount);


export default submissionRoutes;