import mongoose, { Schema, Document } from 'mongoose';

export interface INutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface IRecipe extends Document {
  _id: string;
  title: string;
  description: string;
  image: string;
  imagePublicId?: string; // For Cloudinary image management
  author: mongoose.Types.ObjectId;
  authorName: string; // Denormalized for performance
  cookTime: string;
  prepTime: string;
  servings: number;
  rating: number;
  reviewCount: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  ingredients: string[];
  instructions: string[];
  nutrition?: INutrition;
  tips?: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionSchema = new Schema<INutrition>({
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: String,
    required: true
  },
  carbs: {
    type: String,
    required: true
  },
  fat: {
    type: String,
    required: true
  }
}, { _id: false });

const RecipeSchema = new Schema<IRecipe>({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Recipe image is required']
  },
  imagePublicId: {
    type: String,
    default: null
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipe author is required']
  },
  authorName: {
    type: String,
    required: true
  },
  cookTime: {
    type: String,
    required: [true, 'Cook time is required'],
    match: [/^\d+\s*(min|hour|hrs?)$/i, 'Cook time format is invalid (e.g., "30 min", "1 hour")']
  },
  prepTime: {
    type: String,
    required: [true, 'Prep time is required'],
    match: [/^\d+\s*(min|hour|hrs?)$/i, 'Prep time format is invalid (e.g., "15 min", "1 hour")']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1'],
    max: [50, 'Servings cannot exceed 50']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Recipe category is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Appetizers'],
    default: 'Dinner'
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  ingredients: [{
    type: String,
    required: true,
    trim: true,
    minlength: [1, 'Ingredient cannot be empty'],
    maxlength: [200, 'Ingredient cannot exceed 200 characters']
  }],
  instructions: [{
    type: String,
    required: true,
    trim: true,
    minlength: [5, 'Instruction must be at least 5 characters long'],
    maxlength: [1000, 'Instruction cannot exceed 1000 characters']
  }],
  nutrition: {
    type: NutritionSchema,
    default: null
  },
  tips: [{
    type: String,
    trim: true,
    maxlength: [300, 'Tip cannot exceed 300 characters']
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create indexes for better query performance
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
RecipeSchema.index({ author: 1, createdAt: -1 });
RecipeSchema.index({ category: 1, difficulty: 1 });
RecipeSchema.index({ rating: -1, reviewCount: -1 });
RecipeSchema.index({ createdAt: -1 });
RecipeSchema.index({ isPublished: 1 });

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
