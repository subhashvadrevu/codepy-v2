import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { submitCode } from "../controllers/submission.controllers.js";

const submissionRoutes = express.Router();

submissionRoutes.post("/", authMiddleware, submitCode);


export default submissionRoutes;