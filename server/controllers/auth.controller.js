import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { config } from "../config/config.js";

// Sign in
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    // Simple password check (plain text)
    if (user.password !== password) {
      return res.status(401).json({ error: "Email and password don't match." });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, admin: user.admin },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("t", token, { httpOnly: true, sameSite: "lax" });

    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, admin: user.admin },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Could not sign in" });
  }
};


// Sign out
const signout = (_req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "Signed out successfully." });
};

// JWT guard – reads token from Authorization header
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  getToken: (req) => {
    if (req.headers.authorization?.startsWith("Bearer ")) {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  },
});

// Attach a simple user object from token
const setUser = (req, res, next) => {
  if (req.auth?._id && req.auth?.name) {
    req.user = { _id: req.auth._id, name: req.auth.name, admin: !!req.auth.admin };
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

// Only the owner of the profile can proceed (or admin)
const hasAuthorization = (req, _res, next) => {
  const ok = req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if (!ok) return next("route"); // let route decide further (or send 403 where used)
  return next();
};

// Admin-only gate
const isAdmin = (req, res, next) => {
  if (req.auth?.admin === true) return next();
  return res.status(403).json({ error: "User is not authorized as admin" });
};

// Owner or admin
const canUpdateUser = (req, res, next) => {
  if (req.auth && (req.auth._id === req.profile._id.toString() || req.auth.admin === true)) {
    return next();
  }
  return res.status(403).json({ error: "User is not authorized" });
};

// Forgot password – return token + (optional) security question
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const resetToken = jwt.sign({ _id: user._id, email: user.email }, config.jwtSecret, {
      expiresIn: "1h",
    });

    return res.json({
      token: resetToken,
      securityQuestion: user.securityQuestion || "No security question registered.",
    });
  } catch {
    return res.status(500).json({ error: "Could not process forgot password" });
  }
};

// Verify security answer
const verifySecurityAnswer = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.authenticateSecurityAnswer(securityAnswer)) {
      return res.status(400).json({ error: "Incorrect security answer" });
    }
    return res.json({ message: "Security answer verified." });
  } catch {
    return res.status(500).json({ error: "Server error verifying security answer" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = newPassword; // virtual setter
    await user.save();

    return res.json({ message: "Password has been reset successfully." });
  } catch {
    return res.status(500).json({ error: "Server error resetting password" });
  }
};

export default {
  signin,
  signout,
  requireSignin,
  setUser,
  hasAuthorization,
  isAdmin,
  canUpdateUser,
  forgotPassword,
  verifySecurityAnswer,
  resetPassword,
};
