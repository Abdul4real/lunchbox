// server/controllers/adminAuthController.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
    jwtid: crypto.randomUUID(),
  });

// POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const admin = await User.findOne({ email: email.toLowerCase(), role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.isSuspended) return res.status(403).json({ message: "Admin suspended" });

    const ok = await admin.matchPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id, "admin");
    res.json({
      message: "Login successful",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
