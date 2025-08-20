# RecipeShare (Project 2)

Full‑stack app to create, view, comment, rate and favorite recipes.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express.js
- DB: MongoDB with Mongoose
- Image Uploads: multer (stored locally under `/uploads`)

## Features
- Auth (JWT): signup/login
- Recipes CRUD with image upload
- Comments, Ratings (1–5) with average
- Favorites list (per user)
- Search on homepage
- Responsive (simple CSS)

## Local Setup

### 1) Backend
```bash
cd backend
cp .env.example .env
# edit .env if needed
npm install
npm run dev
```
API URL: `http://localhost:5000`

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
App URL: `http://localhost:5173`

> If ports differ, set `VITE_API_BASE` in a `.env` file in `frontend/`:
```
VITE_API_BASE=http://localhost:5000
```

## API Endpoints (minimum 6 achieved)
- `POST /api/auth/signup`, `POST /api/auth/login`
- `POST /api/recipes` (auth, multipart `image`) – Create
- `GET /api/recipes` – List all
- `GET /api/recipes/:id` – Single
- `PUT /api/recipes/:id` (auth) – Update
- `DELETE /api/recipes/:id` (auth) – Delete
- `POST /api/recipes/:id/comments` (auth) – Comment
- `POST /api/recipes/:id/ratings` (auth) – Rate (1–5)
- `POST /api/recipes/:id/favorite` (auth) – Toggle favorite
- `GET /api/recipes/favorites` (auth) – My favorites list

## Deployment
- **Frontend (Vercel)**: Build with `npm run build`; set `VITE_API_BASE` to your API URL.
- **Backend (Render or Vercel serverless)**: Provide env vars from `.env`. Make `/uploads` publicly served.

## Clean Commit History Tips
- Small, purposeful commits
- Present tense, descriptive messages
- No noisy dependencies (use `.gitignore`); don’t commit `node_modules`
- Squash fix‑ups before PR/merge
- Example: `feat: add recipe model`, `feat(api): create recipe endpoint`, `fix: auth middleware token parse`, `docs: add deployment steps`

---

This is a minimal, working MVP. Enhance styling/UX as desired.
