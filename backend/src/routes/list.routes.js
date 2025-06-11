import express from "express";
import { authMiddleware, isEmailVerified } from "../middlewares/auth.middlewares.js";
import { addProblemToList, createList, deleteList, getAllListDetails, getListById, removeProblemFromList } from "../controllers/list.controllers.js";

const listRoutes = express.Router();

listRoutes.post("/create", authMiddleware, isEmailVerified, createList);

listRoutes.post("/:id/addProblem",authMiddleware, isEmailVerified, addProblemToList);

listRoutes.delete("/delete/:id", authMiddleware, isEmailVerified, deleteList);

listRoutes.delete("/delete/:id/removeProblem", authMiddleware, isEmailVerified, removeProblemFromList);

listRoutes.get("/", authMiddleware, isEmailVerified, getAllListDetails); 

listRoutes.get("/:id", authMiddleware, isEmailVerified, getListById);

export default listRoutes;