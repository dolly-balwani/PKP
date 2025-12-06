import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import chatRouter from "./Routes/chatRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// Enable CORS for frontend dev and deployed apps.
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use("/api/chat", chatRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 10000}`);
});
