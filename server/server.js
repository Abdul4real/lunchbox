import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import recipesRoutes from "./routes/recipes.routes.js";
//import reviewsRoutes from "./routes/reviews.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Uploads directory
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// --- Middleware ---
// JSON parser
app.use(express.json({ limit: "1mb" }));

// Security
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: "Too many requests from this IP, please try again after a minute.",
  })
);

// CORS for frontend
const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:5173";

// Serve uploads with CORP header for cross-origin images
app.use(
  "/uploads",
  cors({ origin: FRONTEND_URL, credentials: true }),
  express.static(uploadPath, {
    setHeaders: (res, filePath) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
// CORS for API routes
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/recipes", recipesRoutes);

// Nested Reviews Route
app.use(
  "/api/recipes/:id/reviews",
  (req, res, next) => {
    if (req.params.id) req.recipeId = req.params.id;
    next();
  },
  //reviewsRoutes
);

app.use("/api/reports", reportsRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// --- Start server ---
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () =>
    console.log(`✓ API listening on http://localhost:${PORT}`)
  );
});
