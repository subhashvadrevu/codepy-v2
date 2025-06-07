import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import listRoutes from "./routes/list.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true
}));

app.get("/", (req, res) => {
    console.log('hello, welcome to codepy... ❤️')
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/submit", submissionRoutes);
app.use("/api/v1/list", listRoutes);

app.listen(process.env.PORT, () => {
    console.log('server is running on prot 5555');
});
