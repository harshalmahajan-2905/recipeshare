import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';
import {
  createRecipe, getAllRecipes, getRecipe,
  updateRecipe, deleteRecipe, addComment, rateRecipe,
  toggleFavorite, getFavorites
} from '../controllers/recipeController.js';

const router = Router();

router.get('/', getAllRecipes);
router.get('/favorites', auth, getFavorites);
router.get('/:id', getRecipe);

router.post('/', auth, upload.single('image'), createRecipe);
router.put('/:id', auth, upload.single('image'), updateRecipe);
router.delete('/:id', auth, deleteRecipe);

router.post('/:id/comments', auth, addComment);
router.post('/:id/ratings', auth, rateRecipe);
router.post('/:id/favorite', auth, toggleFavorite);

export default router;
