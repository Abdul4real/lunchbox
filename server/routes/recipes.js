import express from 'express';
import {
  createRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createRecipe);
router.get('/my-recipes', getMyRecipes);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;