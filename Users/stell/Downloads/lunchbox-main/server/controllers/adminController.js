import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import Review from "../models/Review.js";

/* ------------------------------ Dashboard ------------------------------ */
export const dashboard = async (_req, res) => {
  try {
    const [users, recipes, reviews] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Review.countDocuments(),
    ]);
    res.json({ totals: { users, recipes, reviews } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------- Users -------------------------------- */
export const listUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
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

export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspended } = req.body ?? {};
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isSuspended: !!suspended } },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      message: suspended ? "User suspended" : "User unsuspended",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body ?? {};
    if (!newPassword)
      return res.status(400).json({ message: "newPassword required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const u = await User.findByIdAndDelete(id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------- Admin Add Recipe ---------------------------- */
export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description = "",
      ingredients = [],
      instructions = [],
      metadata = {},
      status,
    } = req.body ?? {};

    if (!title?.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    // Load admin user to stamp author
    const admin = await User.findById(req.userId).select("name email role");
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    // Normalize ingredients: allow ["Sugar 1 tsp", "Egg 2"] or structured array
    const normIngredients = (Array.isArray(ingredients) ? ingredients : [])
      .map((it) =>
        typeof it === "string"
          ? { name: it }
          : {
              name: it?.name ?? "",
              quantity: it?.quantity ?? undefined,
              unit: it?.unit ?? undefined,
            }
      )
      .filter((i) => i.name?.trim());

    // Normalize instructions: allow strings or objects
    const normInstructions = (Array.isArray(instructions)
      ? instructions
      : []
    ).map((step, idx) =>
      typeof step === "string"
        ? { stepNumber: idx + 1, description: step }
        : {
            stepNumber: step?.stepNumber ?? idx + 1,
            description: step?.description ?? "",
            duration: step?.duration ?? undefined,
          }
    );

    // Admin-created recipes default to "approved" unless overridden
    const allowedStatuses = ["pending", "approved", "rejected"];
    const finalStatus = allowedStatuses.includes(status)
      ? status
      : "approved";

    const recipe = await Recipe.create({
      title: title.trim(),
      description,
      ingredients: normIngredients,
      instructions: normInstructions,
      metadata,
      author: {
        userId: admin._id,
        username:
          admin.name || (admin.email?.split("@")[0] ?? "Administrator"),
      },
      status: finalStatus,
    });

    res.status(201).json({ message: "Recipe created", recipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------------------- Recipes ------------------------------- */
export const listRecipes = async (req, res) => {
  try {
    const status = req.query.status; // pending/approved/rejected (optional)
    const filter = status ? { status } : {};
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRecipeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};
    if (!status) return res.status(400).json({ message: "status required" });
    const r = await Recipe.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!r) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe status updated", recipe: r });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Recipe.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!r) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe updated", recipe: r });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Recipe.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------- Reports ------------------------------ */
export const listReports = async (_req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Resolve a report. Optionally take corrective action:
 * body: { action: "approve" | "dismiss", deleteRecipe?: boolean, suspendUserId?: string }
 */
export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, deleteRecipe = false, suspendUserId } = req.body ?? {};
    if (!action) return res.status(400).json({ message: "action required" });

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Report not found" });

    review.resolution = action === "approve" ? "approved" : "dismissed";
    await review.save();

    const results = { review };

    if (action === "approve" && deleteRecipe) {
      await Recipe.findByIdAndDelete(review.recipeId);
      results.recipeDeleted = true;
    }

    if (action === "approve" && suspendUserId) {
      await User.findByIdAndUpdate(suspendUserId, {
        $set: { isSuspended: true },
      });
      results.userSuspended = suspendUserId;
    }

    res.json({ message: "Report resolved", ...results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
