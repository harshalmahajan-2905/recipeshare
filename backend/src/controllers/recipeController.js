import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

export const createRecipe = async (req, res) => {
  const { title, description, ingredients, steps } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const recipe = await Recipe.create({
    title,
    description,
    ingredients: Array.isArray(ingredients) ? ingredients : (ingredients || '').split('\n').filter(Boolean),
    steps: Array.isArray(steps) ? steps : (steps || '').split('\n').filter(Boolean),
    imageUrl,
    author: req.user.id
  });
  res.status(201).json(recipe);
};

export const getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find().sort({ createdAt: -1 });
  res.json(recipes);
};

export const getRecipe = async (req, res) => {
  const r = await Recipe.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json(r);
};

export const updateRecipe = async (req, res) => {
  const r = await Recipe.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  if (r.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  const { title, description, ingredients, steps } = req.body;
  if (title) r.title = title;
  if (description) r.description = description;
  if (ingredients) r.ingredients = Array.isArray(ingredients) ? ingredients : ingredients.split('\n').filter(Boolean);
  if (steps) r.steps = Array.isArray(steps) ? steps : steps.split('\n').filter(Boolean);
  if (req.file) r.imageUrl = `/uploads/${req.file.filename}`;
  await r.save();
  res.json(r);
};

export const deleteRecipe = async (req, res) => {
  const r = await Recipe.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  if (r.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  await r.deleteOne();
  res.json({ message: 'Deleted' });
};

export const addComment = async (req, res) => {
  const r = await Recipe.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  r.comments.push({ user: req.user.id, text: req.body.text });
  await r.save();
  res.status(201).json(r);
};

export const rateRecipe = async (req, res) => {
  const { value } = req.body;
  if (value < 1 || value > 5) return res.status(400).json({ message: 'Rating 1-5' });
  const r = await Recipe.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  const existing = r.ratings.find(x => x.user.toString() === req.user.id);
  if (existing) existing.value = value; else r.ratings.push({ user: req.user.id, value });
  await r.save();
  res.json(r);
};

export const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user.id);
  const id = req.params.id;
  const idx = user.favorites.findIndex(fid => fid.toString() == id);
  if (idx >= 0) user.favorites.splice(idx, 1); else user.favorites.push(id);
  await user.save();
  res.json({ favorites: user.favorites });
};

export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  res.json(user.favorites || []);
};
