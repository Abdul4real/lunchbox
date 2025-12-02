import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/error.js";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import recipesRoutes from "./routes/recipes.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();

// security & utils
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "uploads"));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/recipes", recipesRoutes);
// nested: /api/recipes/:id/reviews
app.use("/api/recipes/:id/reviews", (req, res, next) => { req.params.id && next(); }, reviewsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`✓ API listening on http://localhost:${PORT}`));
});
