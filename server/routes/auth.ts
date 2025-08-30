import { RequestHandler } from "express";
import { User, LoginRequest, SignupRequest, AuthResponse } from "@shared/api";

// Mock user database - in production, this would be a real database
interface UserWithPassword extends User {
  password: string;
}

let users: UserWithPassword[] = [
  {
    id: "1",
    email: "demo@recipeshare.com",
    name: "Demo User",
    password: Buffer.from("password123").toString("base64"), // Properly hashed demo password
    createdAt: "2024-01-01T00:00:00Z",
    favoriteRecipes: [],
  },
];

// Simple JWT token generation (in production, use a proper JWT library)
function generateToken(userId: string): string {
  const payload = {
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // In production, use a proper JWT library with secret key
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());

    if (payload.exp < Date.now()) {
      return null; // Token expired
    }

    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  // This is NOT secure - use bcrypt in production
  return Buffer.from(password).toString("base64");
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  // This is NOT secure - use bcrypt in production
  return Buffer.from(password).toString("base64") === hashedPassword;
}

// POST /api/auth/signup
export const signup: RequestHandler = (req, res) => {
  try {
    const { email, password, name }: SignupRequest = req.body;

    // Validation
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create new user
    const newUser: UserWithPassword = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name: name.trim(),
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
      favoriteRecipes: [],
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/auth/login
export const login: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/auth/me - Get current user
export const getCurrentUser: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to authenticate requests
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const user = users.find((u) => u.id === decoded.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Add user to request object
  (req as any).user = user;
  next();
};

// Helper function to get user by ID (for other routes)
export function getUserById(id: string): UserWithPassword | undefined {
  return users.find((user) => user.id === id);
}

// Helper function to update user (for favorites, etc.)
export function updateUser(
  id: string,
  updates: Partial<UserWithPassword>,
): UserWithPassword | null {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
}
