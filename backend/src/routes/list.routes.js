import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { addProblemToList, createList, deleteList, getAllListDetails, getListById, removeProblemFromList } from "../controllers/list.controllers.js";

const listRoutes = express.Router();

listRoutes.post("/create", authMiddleware, createList);

listRoutes.post("/:id/addProblem",authMiddleware, addProblemToList);

listRoutes.delete("/delete/:id", authMiddleware, deleteList);

listRoutes.delete("/delete/:id/removeProblem", authMiddleware, removeProblemFromList);

listRoutes.get("/", authMiddleware, getAllListDetails); 

listRoutes.get("/:id", authMiddleware, getListById);

export default listRoutes;