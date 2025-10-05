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
    // origin: 'http://localhost:5173',
    // credentials: true,
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
app.get("/api/v1/healthCheck", (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Manchiga unna bidda"
        });
    } catch (error) {
        return res.status(500).json({
            error: "emo mama, halath karab ayindi"
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
