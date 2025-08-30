import "dotenv/config";
import express from "express";
import cors from "cors";
import { database, seedDatabase } from "./config/database";
import { handleDemo } from "./routes/demo";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeComments,
  addRecipeComment,
  getRecipesByUser,
} from "./routes/recipesMongo";
import {
  signup,
  login,
  getCurrentUser,
  authenticateToken,
} from "./routes/authMongo";
import {
  uploadImageMiddleware,
  uploadImageFromUrl,
  deleteImage,
  getImageInfo
} from "./routes/upload";
import { testCloudinaryConnection } from "./config/cloudinary";

export function createServer() {
  const app = express();

  // Initialize database connection
  database.connect().then(() => {
    // Seed database with initial data if needed
    seedDatabase();
  });

  // Test Cloudinary connection
  testCloudinaryConnection();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication API routes
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", getCurrentUser);

  // Upload API routes
  app.post("/api/upload", uploadImageMiddleware);
  app.post("/api/upload/url", authenticateToken, uploadImageFromUrl);
  app.delete("/api/upload", authenticateToken, deleteImage);
  app.get("/api/upload/:publicId", getImageInfo);

  // Recipe API routes
  app.get("/api/recipes", getAllRecipes);
  app.get("/api/recipes/:id", getRecipeById);
  app.post("/api/recipes", authenticateToken, createRecipe); // Protected route
  app.put("/api/recipes/:id", authenticateToken, updateRecipe); // Protected route
  app.delete("/api/recipes/:id", authenticateToken, deleteRecipe); // Protected route
  app.get("/api/recipes/user/:userId", getRecipesByUser);

  // Comment API routes
  app.get("/api/recipes/:id/comments", getRecipeComments);
  app.post("/api/recipes/:id/comments", addRecipeComment);

  return app;
}
