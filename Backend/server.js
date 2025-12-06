import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import chatRouter from "./routes/chatRoutes.js";
import userRouter from "./routes/userRoutes.js";
import counsellorRouter from "./routes/counsellorRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import sahaayRouter from "./routes/sahaayRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";

dotenv.config();

/* ---------- Path setup for ES Modules ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS Settings
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5000",
            process.env.CORS_ORIGIN || "http://localhost:3000"
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

/* ---------- API Routes ---------- */
app.use("/api/chat", chatRouter);
app.use("/api/sahaay", sahaayRouter);
app.use("/api/users", userRouter);
app.use("/api/counsellors", counsellorRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api", assessmentRoutes);

/* ---------- Health Check ---------- */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

/* ---------- Production Frontend Serve ---------- */
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend/build", "index.html"));
    });
}

/* ---------- MongoDB Connection ---------- */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("🔥 MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};

/* ---------- Server Start ---------- */
const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running on port ${PORT}`);
});

/* ---------- Global Error Handling ---------- */
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
});
