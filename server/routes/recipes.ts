import { RequestHandler } from "express";

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

// Mock data - in a real app, this would be a database
let recipes: Recipe[] = [
  {
    id: "1",
    title: "Creamy Tuscan Chicken",
    description:
      "A rich and flavorful chicken dish with sun-dried tomatoes, spinach, and a creamy sauce.",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=300&fit=crop",
    author: "Maria Rossi",
    authorId: "user-1",
    cookTime: "25 min",
    prepTime: "10 min",
    servings: 4,
    rating: 4.8,
    reviewCount: 124,
    category: "Dinner",
    difficulty: "Medium",
    tags: ["Italian", "Chicken", "Creamy"],
    ingredients: [
      "4 boneless, skinless chicken breasts (6-8 oz each)",
      "2 tablespoons olive oil",
      "3 cloves garlic, minced",
      "1 cup heavy cream",
      "1/2 cup chicken broth",
      "1/2 cup sun-dried tomatoes, chopped",
      "1/3 cup grated Parmesan cheese",
      "3 cups fresh spinach",
      "1 teaspoon Italian seasoning",
      "1/2 teaspoon paprika",
      "Salt and pepper to taste",
      "Fresh basil for garnish",
    ],
    instructions: [
      "Season chicken breasts with salt, pepper, and paprika on both sides.",
      "Heat olive oil in a large skillet over medium-high heat. Add chicken and cook for 6-7 minutes on each side until golden brown and cooked through. Remove and set aside.",
      "In the same skillet, add minced garlic and cook for 1 minute until fragrant.",
      "Pour in chicken broth and scrape up any browned bits from the bottom of the pan.",
      "Add heavy cream, sun-dried tomatoes, and Italian seasoning. Stir to combine and bring to a gentle simmer.",
      "Add Parmesan cheese and stir until melted and sauce is smooth.",
      "Add fresh spinach and cook until wilted, about 2-3 minutes.",
      "Return chicken to the skillet and spoon sauce over the top. Simmer for 2-3 minutes to heat through.",
      "Taste and adjust seasoning as needed.",
      "Garnish with fresh basil and serve immediately over pasta, rice, or with crusty bread.",
    ],
    nutrition: {
      calories: 485,
      protein: "42g",
      carbs: "8g",
      fat: "32g",
    },
    tips: [
      "For best results, use chicken breasts that are similar in size for even cooking.",
      "Don't overcook the spinach - it should just be wilted to maintain its vibrant color.",
      "This dish pairs beautifully with garlic mashed potatoes or fettuccine pasta.",
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Classic Chocolate Chip Cookies",
    description:
      "Perfectly chewy cookies with the ideal balance of crispy edges and soft centers.",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=300&fit=crop",
    author: "Baker Emma",
    authorId: "user-2",
    cookTime: "15 min",
    prepTime: "10 min",
    servings: 24,
    rating: 4.9,
    reviewCount: 89,
    category: "Dessert",
    difficulty: "Easy",
    tags: ["Cookies", "Chocolate", "Baking"],
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "1 tsp vanilla extract",
      "2 large eggs",
      "2 cups chocolate chips",
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a medium bowl, combine flour, baking soda, and salt.",
      "In a large bowl, beat butter, granulated sugar, brown sugar, and vanilla until creamy.",
      "Add eggs one at a time, beating well after each addition.",
      "Gradually blend in flour mixture.",
      "Stir in chocolate chips.",
      "Drop rounded tablespoons of dough onto ungreased cookie sheets.",
      "Bake for 9-11 minutes or until golden brown.",
      "Cool on baking sheets for 2 minutes, then remove to wire racks.",
    ],
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "3",
    title: "Mediterranean Quinoa Bowl",
    description:
      "A healthy and colorful bowl packed with fresh vegetables, quinoa, and tahini dressing.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
    author: "Health Chef Alex",
    authorId: "user-3",
    cookTime: "15 min",
    prepTime: "5 min",
    servings: 2,
    rating: 4.7,
    reviewCount: 156,
    category: "Lunch",
    difficulty: "Easy",
    tags: ["Healthy", "Vegan", "Mediterranean"],
    ingredients: [
      "1 cup cooked quinoa",
      "1 cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 red onion, thinly sliced",
      "1/2 cup kalamata olives",
      "1/2 cup crumbled feta cheese",
      "1/4 cup fresh parsley, chopped",
      "2 tbsp tahini",
      "2 tbsp lemon juice",
      "1 tbsp olive oil",
      "1 clove garlic, minced",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Cook quinoa according to package instructions and let cool.",
      "In a large bowl, combine quinoa, cucumber, tomatoes, red onion, olives, and feta.",
      "In a small bowl, whisk together tahini, lemon juice, olive oil, garlic, salt, and pepper.",
      "Pour dressing over quinoa mixture and toss to combine.",
      "Garnish with fresh parsley and serve immediately.",
    ],
    nutrition: {
      calories: 320,
      protein: "12g",
      carbs: "35g",
      fat: "16g",
    },
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
];

let comments: Comment[] = [
  {
    id: "1",
    recipeId: "1",
    author: "Chef Emma",
    authorId: "user-4",
    content:
      "This recipe is absolutely divine! The sauce is so creamy and flavorful. I added a bit of white wine and it turned out amazing.",
    rating: 5,
    createdAt: "2024-01-16T15:30:00Z",
  },
  {
    id: "2",
    recipeId: "1",
    author: "Home Cook Jake",
    authorId: "user-5",
    content:
      "Made this for dinner tonight and my family loved it! The instructions were clear and easy to follow. Will definitely make again.",
    rating: 5,
    createdAt: "2024-01-15T20:45:00Z",
  },
];

// GET /api/recipes - Get all recipes
export const getAllRecipes: RequestHandler = (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    let filteredRecipes = [...recipes];

    // Filter by category
    if (category && category !== "All") {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.category === category,
      );
    }

    // Filter by difficulty
    if (difficulty && difficulty !== "All") {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.difficulty === difficulty,
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }

    res.json({
      recipes: filteredRecipes,
      total: filteredRecipes.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// GET /api/recipes/:id - Get single recipe
export const getRecipeById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const recipe = recipes.find((r) => r.id === id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

// POST /api/recipes - Create new recipe
export const createRecipe: RequestHandler = (req, res) => {
  try {
    const {
      title,
      description,
      image,
      author,
      cookTime,
      prepTime,
      servings,
      category,
      difficulty,
      tags,
      ingredients,
      instructions,
      nutrition,
      tips,
    } = req.body;

    // Simple validation
    if (!title || !description || !ingredients || !instructions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      title,
      description,
      image:
        image ||
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
      author: author || "Anonymous Chef",
      authorId: "user-current", // In a real app, this would come from authentication
      cookTime: cookTime || "30 min",
      prepTime: prepTime || "15 min",
      servings: servings || 4,
      rating: 0,
      reviewCount: 0,
      category: category || "Other",
      difficulty: difficulty || "Medium",
      tags: tags || [],
      ingredients,
      instructions,
      nutrition,
      tips,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// PUT /api/recipes/:id - Update recipe
export const updateRecipe: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const recipeIndex = recipes.findIndex((r) => r.id === id);

    if (recipeIndex === -1) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // In a real app, check if user owns this recipe
    const recipe = recipes[recipeIndex];
    const updatedRecipe = {
      ...recipe,
      ...req.body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    recipes[recipeIndex] = updatedRecipe;
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

// DELETE /api/recipes/:id - Delete recipe
export const deleteRecipe: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const recipeIndex = recipes.findIndex((r) => r.id === id);

    if (recipeIndex === -1) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // In a real app, check if user owns this recipe
    recipes.splice(recipeIndex, 1);

    // Also delete associated comments
    comments = comments.filter((c) => c.recipeId !== id);

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};

// GET /api/recipes/:id/comments - Get comments for a recipe
export const getRecipeComments: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const recipeComments = comments.filter((c) => c.recipeId === id);
    res.json(recipeComments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// POST /api/recipes/:id/comments - Add comment to recipe
export const addRecipeComment: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { author, content, rating } = req.body;

    // Check if recipe exists
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Simple validation
    if (!content || !rating) {
      return res.status(400).json({ error: "Content and rating are required" });
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      recipeId: id,
      author: author || "Anonymous",
      authorId: "user-current", // In a real app, this would come from authentication
      content,
      rating: Math.max(1, Math.min(5, rating)), // Ensure rating is between 1-5
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);

    // Update recipe rating and review count
    const recipeComments = comments.filter((c) => c.recipeId === id);
    const avgRating =
      recipeComments.reduce((sum, c) => sum + c.rating, 0) /
      recipeComments.length;

    const recipeIndex = recipes.findIndex((r) => r.id === id);
    if (recipeIndex !== -1) {
      recipes[recipeIndex].rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
      recipes[recipeIndex].reviewCount = recipeComments.length;
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};
