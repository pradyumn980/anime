import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import avatarRoutes from './routes/avatarRoutes.js'
import connectDB from "./config/database.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
connectDB();
console.log("Mongo URI:", process.env.MONGODB_URI);
const app = express();

app.use(cors({ origin: "https://animefinder247.vercel.app", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api",avatarRoutes)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
