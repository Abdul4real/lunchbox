// server/controllers/authController.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import { tokenBlacklist } from "../utils/tokenBlacklist.js";

const generateToken = (id, role = "user") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
    jwtid: crypto.randomUUID(),
  });

// POST /api/auth/signup
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email, password required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role: "user" });
    const token = generateToken(user._id, "user");

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/signin
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isSuspended) return res.status(403).json({ message: "Account suspended" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/signout
export const logoutUser = (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.json({ message: "User logged out" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.jti) tokenBlacklist.add(payload.jti);
  } catch {
    // ignore
  }
  return res.json({ message: "User logged out" });
};
