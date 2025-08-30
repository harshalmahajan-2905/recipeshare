import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthResponse, LoginRequest, SignupRequest } from "@shared/api";

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST /api/auth/signup
export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, password, name }: SignupRequest = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    if (name.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    
    // Create new user (password will be hashed by the schema pre-save hook)
    const newUser = new User({
      email: email.toLowerCase(),
      name: name.trim(),
      password
    });
    
    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser._id.toString());
    
    // Return user without password (handled by toJSON transform)
    const userObj = newUser.toJSON();
    const response: AuthResponse = {
      user: userObj as any, // Type assertion for MongoDB to API conversion
      token
    };
    
    res.status(201).json(response);
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0] as any;
      return res.status(400).json({ error: firstError.message });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/auth/login
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Find user (include password for verification)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    // Return user without password
    const userObj = user.toJSON();
    const response: AuthResponse = {
      user: userObj as any, // Type assertion for MongoDB to API conversion
      token
    };
    
    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/auth/me - Get current user
export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user.toJSON());
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to authenticate requests
export const authenticateToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Add user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to get user from request
export function getUserFromRequest(req: any): IUser | null {
  return req.user || null;
}
