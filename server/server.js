// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";   // ⬅️ NEW import

dotenv.config();
const app = express();

app.use(
  cors({
    origin: true, // or ['http://localhost:5173'] to restrict
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => res.send("Lunchbox API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);                 // ⬅️ NEW route mount

// Debug helper while testing
app.post("/debug/echo", (req, res) => res.json({ body: req.body }));

// 404 + error handlers
app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.use((err, _req, res, _next) =>
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" })
);

// start after DB connects
await connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
