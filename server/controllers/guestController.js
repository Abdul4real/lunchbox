import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

//  Get all published recipes with filtering and pagination
// @route   GET /api/guest/recipes
// @access  Public
export const getAllRecipes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      cuisine,
      dietary,
      difficulty,
      maxTime,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object -- only published recipes
    const filter = { status: 'published' };

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'metadata.tags': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Cuisine filter
    if (cuisine) {
      filter['metadata.cuisineType'] = { $regex: cuisine, $options: 'i' };
    }

    // Dietary restrictions filter
    if (dietary) {
      filter['metadata.dietaryTags'] = { $in: dietary.split(',') };
    }

    // Difficulty filter
    if (difficulty) {
      filter['metadata.difficulty'] = difficulty;
    }

    // Time filter
    if (maxTime) {
      filter['metadata.totalTime'] = { $lte: parseInt(maxTime) };
    }

    // Rating filter
    if (minRating) {
      filter['stats.averageRating'] = { $gte: parseFloat(minRating) };
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions['stats.averageRating'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'views') {
      sortOptions['stats.views'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'popular') {
      sortOptions['stats.likes'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const recipes = await Recipe.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title description metadata stats author media')
      .populate('author.userId', 'username profile')
      .exec();

    // Get total count for pagination
    const total = await Recipe.countDocuments(filter);

    res.json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecipes: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes'
    });
  }
};

// Get single recipe by ID
// @route   GET /api/guest/recipes/:id
// @access  Public
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ 
      _id: req.params.id, 
      status: 'published' 
    }).populate('author.userId', 'username profile stats');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Increment view count
    recipe.stats.views += 1;
    await recipe.save();

    // Get reviews for this recipe
    const reviews = await Review.find({ recipeId: recipe._id })
      .populate('author.userId', 'username profile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        recipe,
        reviews
      }
    });
  } catch (error) {
    console.error('Get recipe by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipe'
    });
  }
};

// Search recipes
// @route   GET /api/guest/recipes/search
// @access  Public
export const searchRecipes = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const recipes = await Recipe.find({
      status: 'published',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'ingredients.name': { $regex: q, $options: 'i' } },
        { 'metadata.tags': { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .limit(parseInt(limit))
    .select('title description metadata stats author media')
    .populate('author.userId', 'username profile');

    res.json({
      success: true,
      data: recipes,
      query: q
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching recipes'
    });
  }
};

// Get featured recipes
// @route   GET /api/guest/featured
// @access  Public
export const getFeaturedRecipes = async (req, res) => {
  try {
    const featuredRecipes = await Recipe.find({ status: 'published' })
      .sort({ 'stats.averageRating': -1, 'stats.views': -1 })
      .limit(6)
      .select('title description metadata stats author media')
      .populate('author.userId', 'username profile');

    res.json({
      success: true,
      data: featuredRecipes
    });
  } catch (error) {
    console.error('Get featured recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured recipes'
    });
  }
};

// Get popular recipes
// @route   GET /api/guest/popular
// @access  Public
export const getPopularRecipes = async (req, res) => {
  try {
    const popularRecipes = await Recipe.find({ status: 'published' })
      .sort({ 'stats.views': -1, 'stats.likes': -1 })
      .limit(8)
      .select('title description metadata stats author media')
      .populate('author.userId', 'username profile');

    res.json({
      success: true,
      data: popularRecipes
    });
  } catch (error) {
    console.error('Get popular recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular recipes'
    });
  }
};

// Get all categories
// @route   GET /api/guest/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ recipeCount: -1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// Get popular chefs
// @route   GET /api/guest/chefs
// @access  Public
export const getPopularChefs = async (req, res) => {
  try {
    const popularChefs = await User.find({ 
      role: { $in: ['contributor', 'admin'] },
      isActive: true 
    })
    .sort({ 'stats.recipesCreated': -1 })
    .limit(10)
    .select('username profile stats');

    res.json({
      success: true,
      data: popularChefs
    });
  } catch (error) {
    console.error('Get popular chefs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chefs'
    });
  }
};