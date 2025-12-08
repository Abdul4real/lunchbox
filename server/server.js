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

// Routes
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import recipesRoutes from "./routes/recipes.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ----------------------------
// SERVE UPLOADS DIRECTORY
// ----------------------------
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// This must run BEFORE CORS so static files always load
app.use(
  "/uploads",
  express.static(uploadPath, {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// ----------------------------
// GLOBAL MIDDLEWARE
// ----------------------------
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(morgan("dev"));

// ----------------------------
// RATE LIMITING
// ----------------------------
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: "Too many requests from this IP, please try again after a minute.",
  })
);

// ----------------------------
// FIXED CORS CONFIG
// ----------------------------
const allowedOrigins = [
  "https://lunchbox-wlgs.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ BLOCKED BY CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ----------------------------
// API ROUTES
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/admin", adminRoutes);

// ----------------------------
// ERROR HANDLING
// ----------------------------
app.use(notFound);
app.use(errorHandler);

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () =>
    console.log(`✓ API listening on http://localhost:${PORT}`)
  );
});
