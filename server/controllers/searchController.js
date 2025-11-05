// server/controllers/searchController.js
import Recipe from "../models/Recipe.js";
import Category from "../models/Category.js";
import User from "../models/User.js";


export const searchRecipes = async (req, res) => {
  try {
    const {
      q = "", // general search term
      ingredients = "",
      tags = "",
      cuisineType = "",
      dietaryTags = "",
      mealType = "",
      difficulty = "",
      maxPrepTime,
      maxCookTime,
      minRating,
      author,
      status = "approved", 
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Build filter object
    const filter = { status };

    // Text search across multiple fields
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { "metadata.tags": { $regex: q, $options: "i" } }
      ];
    }

    // Filter by ingredients
    if (ingredients) {
      const ingredientList = ingredients.split(",").map(i => i.trim());
      filter["ingredients.name"] = { 
        $in: ingredientList.map(i => new RegExp(i, "i")) 
      };
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(",").map(t => t.trim());
      filter["metadata.tags"] = { $in: tagList };
    }

    // Filter by cuisine type
    if (cuisineType) {
      filter["metadata.cuisineType"] = cuisineType;
    }

    // Filter by dietary tags
    if (dietaryTags) {
      const dietaryList = dietaryTags.split(",").map(d => d.trim());
      filter["metadata.dietaryTags"] = { $in: dietaryList };
    }

    // Filter by meal type
    if (mealType) {
      const mealList = mealType.split(",").map(m => m.trim());
      filter["metadata.mealType"] = { $in: mealList };
    }

    // Filter by difficulty
    if (difficulty) {
      filter["metadata.difficulty"] = difficulty;
    }

    // Filter by time constraints
    if (maxPrepTime) {
      filter["metadata.prepTime"] = { $lte: parseInt(maxPrepTime) };
    }
    if (maxCookTime) {
      filter["metadata.cookTime"] = { $lte: parseInt(maxCookTime) };
    }

    // Filter by author
    if (author) {
      filter["author.username"] = { $regex: author, $options: "i" };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // Execute search with pagination
    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .populate("author.userId", "name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Recipe.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      },
      filters: req.query
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
};

/**
 * Search recipes by specific ingredient
 */
export const searchByIngredient = async (req, res) => {
  try {
    const { ingredient } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [recipes, total] = await Promise.all([
      Recipe.find({
        "ingredients.name": { $regex: ingredient, $options: "i" },
        status: "approved"
      })
        .populate("author.userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Recipe.countDocuments({
        "ingredients.name": { $regex: ingredient, $options: "i" },
        status: "approved"
      })
    ]);

    res.json({
      success: true,
      data: recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search by ingredient failed",
      error: error.message
    });
  }
};

/**
 * Quick search for autocomplete/suggestions
 */
export const quickSearch = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const recipes = await Recipe.find({
      $and: [
        { status: "approved" },
        {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { "metadata.tags": { $regex: q, $options: "i" } },
            { "metadata.cuisineType": { $regex: q, $options: "i" } }
          ]
        }
      ]
    })
    .select("title description metadata.cuisineType metadata.tags author.username")
    .limit(10)
    .sort({ createdAt: -1 });

    const categories = await Category.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } }
      ]
    })
    .select("name description tags")
    .limit(5);

    res.json({
      success: true,
      data: {
        recipes,
        categories
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Quick search failed",
      error: error.message
    });
  }
};


 // Search users (for admin and social features)
 
export const searchUsers = async (req, res) => {
  try {
    const {
      q = "",
      role = "",
      isSuspended,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Text search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ];
    }

    // Role filter
    if (role) {
      filter.role = role;
    }

    // Suspension status filter
    if (isSuspended !== undefined) {
      filter.isSuspended = isSuspended === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User search failed",
      error: error.message
    });
  }
};


 // Search categories with recipe counts
 
export const searchCategories = async (req, res) => {
  try {
    const { q = "" } = req.query;

    const filter = q ? {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } }
      ]
    } : {};

    const categories = await Category.find(filter)
      .sort({ recipeCount: -1, name: 1 });

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Category search failed",
      error: error.message
    });
  }
};