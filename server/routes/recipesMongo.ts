import { RequestHandler } from "express";
import { Recipe, IRecipe } from '../models/Recipe';
import { Comment, IComment } from '../models/Comment';
import { User } from '../models/User';
import { getUserFromRequest } from './authMongo';
import { CreateRecipeRequest, CreateCommentRequest } from "@shared/api";

// GET /api/recipes - Get all recipes
export const getAllRecipes: RequestHandler = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query: any = { isPublished: true };
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Filter by difficulty
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search as string };
    }
    
    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = Math.min(parseInt(limit as string) || 20, 50); // Max 50 per page
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query with pagination and sorting
    const recipes = await Recipe.find(query)
      .populate('author', 'name')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    // Get total count for pagination
    const total = await Recipe.countDocuments(query);
    
    res.json({
      recipes,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      hasMore: total > pageNum * limitNum
    });
  } catch (error) {
    console.error("Get recipes error:", error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// GET /api/recipes/:id - Get single recipe
export const getRecipeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipe = await Recipe.findById(id)
      .populate('author', 'name email')
      .lean();
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error("Get recipe error:", error);
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// POST /api/recipes - Create new recipe
export const createRecipe: RequestHandler = async (req, res) => {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const {
      title,
      description,
      image,
      cookTime,
      prepTime,
      servings,
      category,
      difficulty,
      tags,
      ingredients,
      instructions,
      nutrition,
      tips
    }: CreateRecipeRequest = req.body;
    
    // Validation (additional to schema validation)
    if (!title || !description || !image || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (ingredients.length === 0) {
      return res.status(400).json({ error: 'At least one ingredient is required' });
    }

    if (instructions.length === 0) {
      return res.status(400).json({ error: 'At least one instruction is required' });
    }
    
    // Create new recipe
    const newRecipe = new Recipe({
      title,
      description,
      image,
      author: user._id,
      authorName: user.name,
      cookTime,
      prepTime,
      servings,
      category,
      difficulty,
      tags: tags || [],
      ingredients,
      instructions,
      nutrition,
      tips: tips || []
    });
    
    const savedRecipe = await newRecipe.save();
    
    // Populate author info for response
    await savedRecipe.populate('author', 'name email');
    
    res.status(201).json(savedRecipe.toJSON());
  } catch (error: any) {
    console.error("Create recipe error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0] as any;
      return res.status(400).json({ error: firstError.message });
    }
    
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

// PUT /api/recipes/:id - Update recipe
export const updateRecipe: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Check if user owns this recipe
    if (recipe.author.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this recipe' });
    }
    
    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    res.json(updatedRecipe?.toJSON());
  } catch (error: any) {
    console.error("Update recipe error:", error);
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0] as any;
      return res.status(400).json({ error: firstError.message });
    }
    
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

// DELETE /api/recipes/:id - Delete recipe
export const deleteRecipe: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Check if user owns this recipe
    if (recipe.author.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }
    
    // Delete recipe and associated comments
    await Promise.all([
      Recipe.findByIdAndDelete(id),
      Comment.deleteMany({ recipe: id })
    ]);
    
    // TODO: Delete associated image from Cloudinary if needed
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error("Delete recipe error:", error);
    
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

// GET /api/recipes/:id/comments - Get comments for a recipe
export const getRecipeComments: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Check if recipe exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNum - 1) * limitNum;
    
    // Get comments
    const comments = await Comment.find({ recipe: id, isApproved: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    const total = await Comment.countDocuments({ recipe: id, isApproved: true });
    
    res.json({
      comments,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// POST /api/recipes/:id/comments - Add comment to recipe
export const addRecipeComment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, rating }: CreateCommentRequest = req.body;
    
    // For now, allow anonymous comments, but in production you might want to require auth
    const authHeader = req.headers.authorization;
    let user = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        user = getUserFromRequest(req);
      } catch (error) {
        // Continue without user for anonymous comments
      }
    }
    
    // Check if recipe exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Validation
    if (!content || !rating) {
      return res.status(400).json({ error: 'Content and rating are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Create comment
    const newComment = new Comment({
      recipe: id,
      author: user?._id || null,
      authorName: user?.name || 'Anonymous',
      content,
      rating: Math.round(rating)
    });
    
    await newComment.save();
    
    // Update recipe rating
    const comments = await Comment.find({ recipe: id, isApproved: true });
    const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
    
    await Recipe.findByIdAndUpdate(id, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: comments.length
    });
    
    // Populate author info for response
    const populatedComment = await Comment.findById(newComment._id)
      .populate('author', 'name')
      .lean();
    
    res.status(201).json(populatedComment);
  } catch (error: any) {
    console.error("Add comment error:", error);
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0] as any;
      return res.status(400).json({ error: firstError.message });
    }
    
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// GET /api/recipes/user/:userId - Get recipes by user
export const getRecipesByUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNum - 1) * limitNum;
    
    // Get recipes by user
    const recipes = await Recipe.find({ author: userId, isPublished: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    const total = await Recipe.countDocuments({ author: userId, isPublished: true });
    
    res.json({
      recipes,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error("Get user recipes error:", error);
    res.status(500).json({ error: 'Failed to fetch user recipes' });
  }
};
