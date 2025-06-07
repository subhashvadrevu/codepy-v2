import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { getAllSubmissionsByUser, getSubmissions, getSubmissionsCountForProblemByAllUsers, getTotalSubmissionsCountByUser, runCode, submitCode } from "../controllers/submission.controllers.js";

const submissionRoutes = express.Router();

submissionRoutes.post("/", authMiddleware, submitCode);

submissionRoutes.post("/run", authMiddleware, runCode);

submissionRoutes.get("/getAllSubmissions", authMiddleware, getAllSubmissionsByUser);

submissionRoutes.get("/getSubmissions/:id", authMiddleware, getSubmissions);

submissionRoutes.get("/getSubmissionCount/:id", getSubmissionsCountForProblemByAllUsers);

submissionRoutes.get("/getTotalSubmissionsByUser/:username", getTotalSubmissionsCountByUser);

export default submissionRoutes;