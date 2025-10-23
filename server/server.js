// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

// Routes (use the lowercase 'routes' folder you actually have)
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

/* ----------------------------- middleware ----------------------------- */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map(s => s.trim()) || true, // e.g. "http://localhost:5173"
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* -------------------------------- routes ------------------------------- */
app.get("/", (_req, res) => res.send("🍽️ Lunchbox API is running..."));

// Public auth
app.use("/api/auth", authRoutes);

// Any authenticated user routes you’ve defined
app.use("/api/users", userRoutes);

// Admin-only suite (login is public inside this router; others require admin)
app.use("/api/admin", adminRoutes);

/* --------------------------- not-found & errors ------------------------ */
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

/* --------------------------- bootstrapping ----------------------------- */
await connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);

/* ------------------------- graceful shutdown --------------------------- */
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
