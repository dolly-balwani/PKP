import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import chatRouter from "./Routes/chatRoutes.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import counsellorRoutes from "./routes/counsellorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS (more controlled)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:4000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/users", userRoutes);
app.use("/api/counsellors", counsellorRoutes);
app.use("/api/appointments", appointmentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
