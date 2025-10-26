import express from 'express';
import {
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  getFeaturedRecipes,
  getPopularRecipes,
  getCategories,
  getPopularChefs
} from '../controllers/guestController.js';

const router = express.Router();

// Public routes for guest users
router.get('/recipes', getAllRecipes);
router.get('/recipes/search', searchRecipes);
router.get('/recipes/:id', getRecipeById);
router.get('/featured', getFeaturedRecipes);
router.get('/popular', getPopularRecipes);
router.get('/categories', getCategories);
router.get('/chefs', getPopularChefs);

export default router;