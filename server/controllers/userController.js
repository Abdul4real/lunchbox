// server/controllers/userController.js
import User from "../models/User.js";
export const listUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const sortField = String(req.query.sort || "createdAt");
    const sortOrder = (req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;

    const filter = q
      ? {
          $or: [
            { name:  { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
