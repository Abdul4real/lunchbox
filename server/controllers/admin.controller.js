// server/controllers/admin.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import Report from "../models/Report.js";

// ─────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log("Login body:", req.body);

    const admin = await User.findOne({ email, role: "admin" }).select(
      "+password"
    );

    // console.log(
    //   "Found admin:",
    //   admin && {
    //     email: admin.email,
    //     role: admin.role,
    //     hasPassword: !!admin.password,
    //   }
    // );

    if (!admin || !admin.password) {
      console.log("No admin found or no password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

// ─────────────────────────────
// OVERVIEW / DASHBOARD COUNTS
// ─────────────────────────────
export const overview = async (_req, res) => {
  try {
    const [users, recipes, reports] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Report.countDocuments(),
    ]);
    res.json({ users, recipes, reports });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ message: "Failed to load overview" });
  }
};

export const getDashboard = async (_req, res) => {
  try {
    const [users, recipes, reports] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Report.countDocuments(),
    ]);

    res.json({ users, recipes, reports });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

// ─────────────────────────────
// USER LIST (search + pagination)
// ─────────────────────────────
export const getUsers = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select("-password"),
      User.countDocuments(query),
    ]);

    res.json({
      data: users,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

// ─────────────────────────────
// SUSPEND / UNSUSPEND USER
// ─────────────────────────────
export const toggleSuspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ message: "Cannot suspend another admin account" });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({
      message: user.isSuspended ? "User suspended" : "User unsuspended",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSuspended: user.isSuspended,
      },
    });
  } catch (err) {
    console.error("Suspend user error:", err);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

// ─────────────────────────────
// DELETE USER
// ─────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ message: "Cannot delete an admin account" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// ─────────────────────────────
// ADMIN RECIPES LIST (ALL STATUSES)
// ─────────────────────────────
export const getAdminRecipes = async (_req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).lean();
    res.json(recipes);
  } catch (err) {
    console.error("getAdminRecipes error:", err);
    res.status(500).json({ message: "Failed to load recipes" });
  }
};

// ─────────────────────────────
// RECIPE STATUS (APPROVE / REJECT / REVOKE)
// ─────────────────────────────
export const setRecipeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "approved", "rejected", "revoked"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const doc = await Recipe.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!doc) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(doc);
  } catch (err) {
    console.error("Set recipe status error:", err);
    res.status(500).json({ message: "Failed to update recipe status" });
  }
};

// ─────────────────────────────
// REPORT MODERATION (APPROVE / DISMISS)
// ─────────────────────────────
export const getAdminReports = async (_req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate("recipe", "title name")
      .lean();

    res.json(reports);
  } catch (err) {
    console.error("getAdminReports error:", err);
    res.status(500).json({ message: "Failed to load reports" });
  }
};

export const setReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "approved", "dismissed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("recipe", "title name")
      .lean();

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (err) {
    console.error("setReportStatus error:", err);
    res.status(500).json({ message: "Failed to update report status" });
  }
};
