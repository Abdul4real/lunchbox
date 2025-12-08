import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const sign = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

export const register = async (req, res) => {
  try {
    registerSchema.parse(req);
  } catch (err) {
    // Catch Zod validation errors
    const message = err.errors?.[0]?.message || "password must contain at least 6 characters";
    return res.status(400).json({ message });
  }

  const exists = await User.findOne({ email: req.body.email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const user = await User.create(req.body);
  const token = sign(user);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req, res) => {
  try {
    loginSchema.parse(req);
  } catch (err) {
    const message = err.errors?.[0]?.message || "password must contain at least 6 characters";
    return res.status(400).json({ message });
  }

  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.compare(req.body.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = sign(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
