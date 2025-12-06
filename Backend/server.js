import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import chatRouter from "./Routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import counsellorRoutes from "./routes/counsellorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:4000",
  optionsSuccessStatus: 200,
}));

/* ---------- Routes ---------- */
app.use("/api/chat", chatRouter);
app.use("/api/users", userRoutes);
app.use("/api/counsellors", counsellorRoutes);
app.use("/api/appointments", appointmentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully ✅" });
});

/* ---------- Database ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
