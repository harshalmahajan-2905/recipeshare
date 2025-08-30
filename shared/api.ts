/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Recipe-related API types
 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  authorId: string;
  cookTime: string;
  prepTime: string;
  servings: number;
  rating: number;
  reviewCount: number;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  ingredients: string[];
  instructions: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  tips?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  recipeId: string;
  author: string;
  authorId: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
}

export interface CreateRecipeRequest {
  title: string;
  description: string;
  image?: string;
  author?: string;
  cookTime?: string;
  prepTime?: string;
  servings?: number;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  ingredients: string[];
  instructions: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  tips?: string[];
}

export interface CreateCommentRequest {
  author?: string;
  content: string;
  rating: number;
}

/**
 * User and Authentication types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  favoriteRecipes?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
