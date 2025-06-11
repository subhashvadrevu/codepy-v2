import express from "express";
import { authMiddleware, isEmailVerified } from "../middlewares/auth.middlewares.js";
import { getAllSubmissionsByUser, getSubmissions, getSubmissionsCountForProblemByAllUsers, getTotalSubmissionsCountByUser, runCode, submitCode } from "../controllers/submission.controllers.js";

const submissionRoutes = express.Router();

submissionRoutes.post("/", authMiddleware, isEmailVerified, submitCode);

submissionRoutes.post("/run", authMiddleware, isEmailVerified, runCode);

submissionRoutes.get("/getAllSubmissions", authMiddleware, isEmailVerified, getAllSubmissionsByUser);

submissionRoutes.get("/getSubmissions/:id", authMiddleware, isEmailVerified, getSubmissions);

submissionRoutes.get("/getSubmissionCount/:id", getSubmissionsCountForProblemByAllUsers);

submissionRoutes.get("/getTotalSubmissionsByUser/:username", authMiddleware, isEmailVerified, getTotalSubmissionsCountByUser);

export default submissionRoutes;