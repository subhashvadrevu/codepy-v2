import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import problemRoutes from "./src/routes/problem.routes.js";
import submissionRoutes from  "./src/routes/submission.routes.js";
import listRoutes from "./src/routes/list.routes.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: ["https://codepy-v2.vercel.app", "https://www.codepy.live"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/submit", submissionRoutes);
app.use("/api/v1/list", listRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
