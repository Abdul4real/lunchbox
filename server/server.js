import express from "express";
import cors from "cors";
import { config, connectDB } from "./config/config.js";

// Import all routes
import userRoutes from "./Routes/user.routes.js";
import recipeRoutes from "./Routes/recipe.routes.js";
import authRoutes from "./Routes/auth.routes.js";
import notificationRoutes from "./Routes/notification.routes.js"; // ✅ NEW

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root health check
app.get("/", (_req, res) => res.send("🍽️ Lunchbox API is running..."));

// Mount route groups
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ NEW

// Connect to MongoDB
connectDB();

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});
