import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Clock,
  Users,
  ChefHat,
  TrendingUp,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Recipe, RecipesResponse } from "@shared/api";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "../components/AuthModal";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-white/90 text-warm-gray font-medium"
          >
            {recipe.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`bg-white/90 border-0 font-medium ${
              recipe.difficulty === "Easy"
                ? "text-green"
                : recipe.difficulty === "Medium"
                  ? "text-orange"
                  : "text-red-600"
            }`}
          >
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display font-semibold text-xl text-foreground group-hover:text-orange transition-colors">
            {recipe.title}
          </h3>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-orange text-orange" />
            <span className="font-semibold text-foreground">
              {recipe.rating}
            </span>
            <span className="text-muted-foreground text-sm">
              ({recipe.reviewCount})
            </span>
          </div>
          <p className="text-sm text-muted-foreground">by {typeof recipe.author === 'string' ? recipe.author : recipe.author?.name || 'Unknown'}</p>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  // Fetch recipes from API
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      if (selectedDifficulty !== "All") {
        params.append("difficulty", selectedDifficulty);
      }
      if (searchTerm.trim()) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/recipes?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data: RecipesResponse = await response.json();
      setRecipes(data.recipes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes on component mount and when filters change
  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  const filteredRecipes = recipes;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-orange" />
              <h1 className="font-display font-bold text-2xl text-warm-gray">
                RecipeShare
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-foreground hover:text-orange transition-colors"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-foreground hover:text-orange transition-colors"
              >
                Categories
              </a>
              {isAuthenticated && (
                <a
                  href="#"
                  className="text-foreground hover:text-orange transition-colors"
                >
                  My Favorites
                </a>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    className="bg-orange hover:bg-orange/90"
                    onClick={() => navigate("/create")}
                  >
                    Share Recipe
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-orange text-white text-sm">
                            {user?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAuthModalTab("login");
                      setShowAuthModal(true);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="bg-orange hover:bg-orange/90"
                    onClick={() => {
                      setAuthModalTab("signup");
                      setShowAuthModal(true);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 gradient-orange">
        <div className="container mx-auto text-center">
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6">
            Discover & Share
            <br />
            Amazing Recipes
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of food lovers. Share your favorite recipes,
            discover new flavors, and connect with fellow cooking enthusiasts
            from around the world.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search recipes, ingredients, or cuisines..."
                className="pl-12 py-3 text-lg bg-white/95 border-0 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-white">
            <div>
              <div className="font-bold text-2xl">2.5K+</div>
              <div className="text-white/80 text-sm">Recipes</div>
            </div>
            <div>
              <div className="font-bold text-2xl">850+</div>
              <div className="text-white/80 text-sm">Cooks</div>
            </div>
            <div>
              <div className="font-bold text-2xl">12K+</div>
              <div className="text-white/80 text-sm">Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-foreground">Categories:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-orange hover:bg-orange/90"
                        : ""
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-foreground">Difficulty:</span>
              <div className="flex gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={
                      selectedDifficulty === difficulty ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={
                      selectedDifficulty === difficulty
                        ? "bg-orange hover:bg-orange/90"
                        : ""
                    }
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Gallery */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-2">
                Featured Recipes
              </h2>
              <p className="text-muted-foreground">
                {filteredRecipes.length} recipe
                {filteredRecipes.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded w-16" />
                      <div className="h-4 bg-muted rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl text-foreground mb-2">
                Failed to load recipes
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchRecipes} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl text-foreground mb-2">
                No recipes found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find more recipes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-green">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-4xl text-white mb-6">
            Ready to Share Your Recipe?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks sharing their favorite dishes. Upload
            your recipe today and inspire others to cook something amazing.
          </p>
          <Button
            size="lg"
            className="bg-white text-green hover:bg-white/90 font-semibold px-8"
            onClick={() => {
              if (isAuthenticated) {
                navigate("/create");
              } else {
                setAuthModalTab("signup");
                setShowAuthModal(true);
              }
            }}
          >
            Share Your Recipe
          </Button>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
}
