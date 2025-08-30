import mongoose from 'mongoose';

interface ConnectionOptions {
  autoIndex: boolean;
  maxPoolSize: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
  family: number;
}

class Database {
  private static instance: Database;
  private connectionString: string;

  private constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeshare';
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const options: ConnectionOptions = {
        autoIndex: true, // Build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
      };

      await mongoose.connect(this.connectionString, options);
      
      console.log('✅ MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      
      if (process.env.NODE_ENV === 'production') {
        // In production, exit the process if database connection fails
        process.exit(1);
      } else {
        // In development, continue without database (fallback to memory)
        console.warn('⚠️  Continuing without database connection in development mode');
      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public getConnectionState(): string {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
  }
}

// Export singleton instance
export const database = Database.getInstance();

// Helper function for seeding initial data
export async function seedDatabase(): Promise<void> {
  try {
    const { User } = await import('../models/User');
    const { Recipe } = await import('../models/Recipe');
    
    // Check if we already have users
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📊 Database already seeded');
      return;
    }

    console.log('🌱 Seeding database...');

    // Create demo user
    const demoUser = new User({
      email: 'demo@recipeshare.com',
      name: 'Demo User',
      password: 'password123'
    });
    await demoUser.save();

    // Create sample recipes
    const sampleRecipes = [
      {
        title: 'Creamy Tuscan Chicken',
        description: 'A rich and flavorful chicken dish with sun-dried tomatoes, spinach, and a creamy sauce.',
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=300&fit=crop',
        author: demoUser._id,
        authorName: demoUser.name,
        cookTime: '25 min',
        prepTime: '10 min',
        servings: 4,
        category: 'Dinner',
        difficulty: 'Medium' as const,
        tags: ['Italian', 'Chicken', 'Creamy'],
        ingredients: [
          '4 boneless, skinless chicken breasts (6-8 oz each)',
          '2 tablespoons olive oil',
          '3 cloves garlic, minced',
          '1 cup heavy cream',
          '1/2 cup chicken broth',
          '1/2 cup sun-dried tomatoes, chopped',
          '1/3 cup grated Parmesan cheese',
          '3 cups fresh spinach'
        ],
        instructions: [
          'Season chicken breasts with salt, pepper, and paprika on both sides.',
          'Heat olive oil in a large skillet over medium-high heat.',
          'Add chicken and cook for 6-7 minutes on each side until golden brown.',
          'Add garlic and cook for 1 minute until fragrant.',
          'Pour in chicken broth and scrape up any browned bits.',
          'Add heavy cream, sun-dried tomatoes, and seasonings.',
          'Add Parmesan cheese and stir until melted.',
          'Return chicken to skillet and simmer for 2-3 minutes.'
        ],
        nutrition: {
          calories: 485,
          protein: '42g',
          carbs: '8g',
          fat: '32g'
        }
      },
      {
        title: 'Classic Chocolate Chip Cookies',
        description: 'Perfectly chewy cookies with the ideal balance of crispy edges and soft centers.',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=300&fit=crop',
        author: demoUser._id,
        authorName: demoUser.name,
        cookTime: '15 min',
        prepTime: '10 min',
        servings: 24,
        category: 'Dessert',
        difficulty: 'Easy' as const,
        tags: ['Cookies', 'Chocolate', 'Baking'],
        ingredients: [
          '2 1/4 cups all-purpose flour',
          '1 tsp baking soda',
          '1 tsp salt',
          '1 cup butter, softened',
          '3/4 cup granulated sugar',
          '3/4 cup packed brown sugar',
          '2 large eggs',
          '2 cups chocolate chips'
        ],
        instructions: [
          'Preheat oven to 375°F (190°C).',
          'In a medium bowl, combine flour, baking soda, and salt.',
          'In a large bowl, beat butter and sugars until creamy.',
          'Add eggs one at a time, beating well after each addition.',
          'Gradually blend in flour mixture.',
          'Stir in chocolate chips.',
          'Drop rounded tablespoons onto ungreased cookie sheets.',
          'Bake for 9-11 minutes or until golden brown.'
        ]
      }
    ];

    for (const recipeData of sampleRecipes) {
      const recipe = new Recipe(recipeData);
      await recipe.save();
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}
