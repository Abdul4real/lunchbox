
import jwt from "jsonwebtoken";
import { tokenBlacklist } from "../utils/tokenBlacklist.js";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.jti && tokenBlacklist.has(payload.jti)) {
      return res.status(401).json({ message: "Token revoked" });
    }
    req.userId = payload.id;
    req.jti = payload.jti;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
