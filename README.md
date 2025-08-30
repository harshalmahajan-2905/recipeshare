# RecipeShare - A Collaborative Recipe Book 🍳

A modern, full-stack recipe sharing application where food enthusiasts can discover, create, and share their favorite recipes. Built with React.js, Node.js, Express.js, MongoDB, and Cloudinary for image management.

![RecipeShare](https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop)

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-app.vercel.app)
- **Backend**: [Deployed on Render](https://your-api.onrender.com)
- **Demo Credentials**: 
  - Email: `demo@recipeshare.com`
  - Password: `password123`

## ✨ Features

### 🔐 **User Authentication**
- Secure JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes and API endpoints
- User profile management

### 📱 **Recipe Management**
- **Create Recipes**: Full recipe creation with photo upload
- **Browse Recipes**: Beautiful gallery with search and filters
- **Recipe Details**: Comprehensive view with ingredients, instructions, and nutrition
- **Image Upload**: Cloudinary integration for high-quality photo storage
- **Categories**: Breakfast, Lunch, Dinner, Dessert, Snacks, Beverages, Appetizers
- **Difficulty Levels**: Easy, Medium, Hard
- **Tags**: Custom tagging system for better discovery

### 💬 **Community Features**
- **Rating System**: 5-star rating with calculated averages
- **Comments & Reviews**: User feedback on recipes
- **Favorites**: Save recipes for later (requires authentication)
- **User Profiles**: View user's recipes, favorites, and activity

### 🎨 **Modern UI/UX**
- Fully responsive design (mobile-first)
- Clean, food-focused interface
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications

### 🔍 **Advanced Search**
- Text search across titles, descriptions, and tags
- Filter by category and difficulty
- Pagination for large datasets
- Real-time search suggestions

## 🛠 Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router 6** for SPA routing
- **TailwindCSS 3** for styling
- **Radix UI** for accessible components
- **React Hook Form** for form management
- **Context API** for state management

### **Backend**
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Cloudinary** for image storage and optimization

### **Database**
- **MongoDB Atlas** (production) / Local MongoDB (development)
- Optimized schemas with proper indexing
- Data validation and sanitization

### **Cloud Services**
- **Cloudinary**: Image upload, storage, and optimization
- **MongoDB Atlas**: Cloud database hosting
- **Vercel**: Frontend deployment
- **Render.com**: Backend deployment

## 📁 Project Structure

```
recipeshare/
├── client/                     # React frontend
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   └── AuthModal.tsx      # Authentication modal
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── pages/
│   │   ├── Index.tsx          # Homepage with recipe gallery
│   │   ├── RecipeDetail.tsx   # Individual recipe view
│   │   ├─�� CreateRecipe.tsx   # Recipe creation form
│   │   └── Profile.tsx        # User profile page
│   ├── App.tsx                # Main app component with routing
│   └── global.css             # Global styles and theme
├── server/                     # Express backend
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── cloudinary.ts      # Cloudinary configuration
│   ├── models/
│   │   ├── User.ts            # User schema
│   │   ├── Recipe.ts          # Recipe schema
│   │   └── Comment.ts         # Comment schema
│   ├── routes/
│   │   ├── authMongo.ts       # Authentication routes
│   │   ├── recipesMongo.ts    # Recipe CRUD operations
│   │   └── upload.ts          # Image upload routes
│   └── index.ts               # Server entry point
├── shared/
│   └── api.ts                 # Shared TypeScript interfaces
└── package.json
```

## 🏃‍♀️ Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**/**pnpm**
- **MongoDB** (local or Atlas account)
- **Cloudinary** account for image uploads

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/recipeshare.git
cd recipeshare
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/recipeshare

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Configuration
NODE_ENV=development
PORT=8080
```

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI accordingly
```

### 5. Run the Application
```bash
# Development mode (both client and server)
pnpm dev

# Or npm
npm run dev
```

Visit `http://localhost:8080` to see the application.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Recipes
- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)
- `GET /api/recipes/user/:userId` - Get user's recipes

### Comments
- `GET /api/recipes/:id/comments` - Get recipe comments
- `POST /api/recipes/:id/comments` - Add comment

### File Upload
- `POST /api/upload` - Upload image to Cloudinary (auth required)
- `POST /api/upload/url` - Upload from URL (auth required)
- `DELETE /api/upload` - Delete image (auth required)

## 🚀 Deployment Guide

### 📋 Prerequisites for Deployment

1. **MongoDB Atlas Account**: [Sign up here](https://www.mongodb.com/cloud/atlas)
2. **Cloudinary Account**: [Sign up here](https://cloudinary.com/)
3. **Vercel Account**: [Sign up here](https://vercel.com/)
4. **Render Account**: [Sign up here](https://render.com/)
5. **GitHub Repository**: Push your code to GitHub

---

### 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new project and cluster (M0 free tier is sufficient for testing)
   - Choose a cloud provider and region
   - Create a database user with username/password
   - Whitelist your IP address (or 0.0.0.0/0 for all IPs)

2. **Get Connection String**:
   - Click \"Connect\" on your cluster
   - Choose \"Connect your application\"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/recipeshare?retryWrites=true&w=majority`

---

### 🖼️ Image Storage Setup (Cloudinary)

1. **Create Cloudinary Account**:
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Go to Dashboard to get your credentials

2. **Get Cloudinary Credentials**:
   - **Cloud Name**: Found in dashboard
   - **API Key**: Found in dashboard  
   - **API Secret**: Found in dashboard (click \"API Keys\" to reveal)

---

### 🌐 Frontend Deployment (Vercel)

1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click \"New Project\"
   - Import your GitHub repository

2. **Configure Build Settings**:
   ```
   Framework Preset: Vite
   Build Command: pnpm build:client
   Output Directory: dist/spa
   Install Command: pnpm install
   ```

3. **Environment Variables**:
   - In Vercel project settings, add environment variables:
   ```
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click \"Deploy\"
   - Your frontend will be available at `https://your-app.vercel.app`

---

### 🔧 Backend Deployment (Render.com)

1. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click \"New\" → \"Web Service\"
   - Connect your GitHub repository

2. **Configure Service**:
   ```
   Name: recipeshare-api
   Environment: Node
   Build Command: pnpm build:server
   Start Command: pnpm start
   ```

3. **Environment Variables**:
   Add these in Render service settings:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/recipeshare?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-production-jwt-key-make-it-very-long-and-random
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   PORT=10000
   ```

4. **Deploy**:
   - Click \"Create Web Service\"
   - Your backend will be available at `https://your-api.onrender.com`

---

### 🔗 Connect Frontend and Backend

1. **Update Frontend API Base URL**:
   - In your frontend code, update API calls to use your Render backend URL
   - Or use environment variables for different environments

2. **CORS Configuration**:
   - Ensure your Express server allows requests from your Vercel domain
   - Update CORS settings in `server/index.ts` if needed

3. **Test the Connection**:
   - Visit your Vercel frontend URL
   - Test user registration, login, and recipe creation
   - Check browser Network tab for API calls

---

### 🔐 Security Checklist

- [ ] Use strong, unique JWT secret in production
- [ ] Whitelist only necessary IP addresses in MongoDB Atlas
- [ ] Enable MongoDB Atlas network access from Render.com IPs
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Implement rate limiting (consider using Render's rate limiting)
- [ ] Regular security updates for dependencies

---

### 📊 Monitoring and Maintenance

1. **Database Monitoring**:
   - Use MongoDB Atlas monitoring dashboard
   - Set up alerts for high usage or errors

2. **Application Monitoring**:
   - Render provides basic metrics and logs
   - Consider integrating with Sentry for error tracking

3. **Image Storage Monitoring**:
   - Monitor Cloudinary usage and bandwidth
   - Set up usage alerts

4. **Performance Optimization**:
   - Enable Cloudinary auto-optimization
   - Use MongoDB indexes for query performance
   - Implement caching strategies if needed

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Type checking
pnpm typecheck

# Format code
pnpm format.fix
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Issues**:
- Check your MongoDB URI format
- Ensure your IP is whitelisted in Atlas
- Verify database user credentials

**Cloudinary Upload Issues**:
- Verify your Cloudinary credentials
- Check image file size (max 5MB)
- Ensure supported image formats (JPG, PNG, WebP)

**Authentication Issues**:
- Check JWT secret configuration
- Verify token expiration settings
- Clear browser localStorage if needed

**Build Issues**:
- Clear node_modules and reinstall dependencies
- Check for TypeScript errors (`pnpm typecheck`)
- Verify environment variables are set

### Getting Help
- Check the [Issues](https://github.com/yourusername/recipeshare/issues) page
- Create a new issue with detailed error information
- Include environment details and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UI Components**: [Radix UI](https://radix-ui.com) for accessible components
- **Icons**: [Lucide React](https://lucide.dev) for beautiful icons
- **Images**: [Unsplash](https://unsplash.com) for stock photos
- **Styling**: [TailwindCSS](https://tailwindcss.com) for utility-first CSS
- **Database**: [MongoDB](https://mongodb.com) for flexible data storage
- **Image Processing**: [Cloudinary](https://cloudinary.com) for image optimization

## 📞 Contact

- **Developer**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourname)

---

Made with ❤️ and lots of ☕ by the RecipeShare team
