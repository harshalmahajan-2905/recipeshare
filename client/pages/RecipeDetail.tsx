import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
} from "lucide-react";
import { Recipe, Comment, CreateCommentRequest } from "@shared/api";
import { useAuth, getAuthHeaders } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  // Fetch recipe by ID
  const fetchRecipe = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Recipe not found");
        }
        throw new Error("Failed to fetch recipe");
      }
      const data: Recipe = await response.json();
      setRecipe(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for recipe
  const fetchComments = async () => {
    if (!id) return;

    try {
      setCommentsLoading(true);
      const response = await fetch(`/api/recipes/${id}/comments`);
      if (response.ok) {
        const data: Comment[] = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
    fetchComments();
  }, [id]);

  // Submit new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || userRating === 0 || !id) return;

    if (!isAuthenticated) {
      // Could show login modal here
      return;
    }

    try {
      const commentData: CreateCommentRequest = {
        author: user?.name || "Anonymous",
        content: newComment,
        rating: userRating,
      };

      const response = await fetch(`/api/recipes/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const newCommentData: Comment = await response.json();
        setComments([newCommentData, ...comments]);
        setNewComment("");
        setUserRating(0);
        // Refresh recipe to get updated rating
        fetchRecipe();
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-semibold mb-2">Loading recipe...</h2>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            {error || "Recipe not found"}
          </h2>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  const adjustedIngredients = recipe.ingredients.map((ingredient) => {
    if (servingMultiplier === 1) return ingredient;

    // Simple regex to find numbers in ingredients and multiply them
    return ingredient.replace(
      /(\d+(?:\.\d+)?)\s*(\/?)\s*(\d+(?:\.\d+)?)?/g,
      (match, num1, slash, num2) => {
        const multiplied1 = (parseFloat(num1) * servingMultiplier).toString();
        if (slash && num2) {
          const multiplied2 = (parseFloat(num2) * servingMultiplier).toString();
          return `${multiplied1}${slash}${multiplied2}`;
        }
        return multiplied1;
      },
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Recipes
              </Button>
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-orange" />
                <span className="font-display font-bold text-xl text-warm-gray">
                  RecipeShare
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${isBookmarked ? "text-orange border-orange" : ""}`}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/");
                    return;
                  }
                  setIsBookmarked(!isBookmarked);
                  // TODO: Implement API call to save/unsave recipe
                }}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-8">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-orange text-white">
                    {recipe.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white"
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>
                <h1 className="font-display font-bold text-4xl mb-2">
                  {recipe.title}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange text-orange" />
                    <span>{recipe.rating}</span>
                    <span className="opacity-75">
                      ({recipe.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-orange text-white font-semibold">
                    {recipe.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Recipe by {recipe.author}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Home cooking enthusiast
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </div>

            {/* Tabs for Ingredients and Instructions */}
            <Tabs defaultValue="ingredients" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="ingredients" className="text-base">
                  Ingredients
                </TabsTrigger>
                <TabsTrigger value="instructions" className="text-base">
                  Instructions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-2xl">
                    Ingredients
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Servings:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setServingMultiplier(
                            Math.max(0.5, servingMultiplier - 0.5),
                          )
                        }
                        disabled={servingMultiplier <= 0.5}
                      >
                        -
                      </Button>
                      <span className="font-semibold px-3">
                        {recipe.servings * servingMultiplier}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setServingMultiplier(servingMultiplier + 0.5)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {adjustedIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-card rounded-lg border"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="space-y-6">
                <h3 className="font-display font-semibold text-2xl">
                  Instructions
                </h3>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-foreground leading-relaxed pt-1">
                        {instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Tips */}
            {recipe.tips && (
              <div className="mb-8 p-6 bg-green-light rounded-2xl">
                <h3 className="font-display font-semibold text-xl mb-4 text-green">
                  Pro Tips
                </h3>
                <ul className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-green flex items-start gap-2"
                    >
                      <span className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Stats */}
            <div className="bg-card p-6 rounded-2xl border">
              <h3 className="font-semibold text-lg mb-4">Recipe Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prep Time</span>
                  <span className="font-medium">{recipe.prepTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cook Time</span>
                  <span className="font-medium">{recipe.cookTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Time</span>
                  <span className="font-medium">{recipe.cookTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servings</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </div>
              </div>
            </div>

            {/* Nutrition */}
            {recipe.nutrition && (
              <div className="bg-card p-6 rounded-2xl border">
                <h3 className="font-semibold text-lg mb-4">
                  Nutrition (per serving)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories</span>
                    <span className="font-medium">
                      {recipe.nutrition.calories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="font-medium">
                      {recipe.nutrition.protein}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="font-medium">
                      {recipe.nutrition.carbs}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fat</span>
                    <span className="font-medium">{recipe.nutrition.fat}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="bg-card p-6 rounded-2xl border">
              <h3 className="font-semibold text-lg mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-orange hover:text-white transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h3 className="font-display font-semibold text-2xl mb-6">
            Reviews & Comments
          </h3>

          {/* Add Comment Form */}
          <div className="bg-card p-6 rounded-2xl border mb-8">
            <h4 className="font-semibold mb-4">Share your experience</h4>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-orange text-white text-sm">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= userRating ? "fill-orange text-orange" : "text-muted-foreground"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Tell us about your cooking experience with this recipe..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || userRating === 0}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Post Review
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">
                  Login to Leave a Review
                </h4>
                <p className="text-muted-foreground mb-4">
                  Share your cooking experience and help others discover great
                  recipes.
                </p>
                <Button onClick={() => navigate("/")} variant="outline">
                  Login to Review
                </Button>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {commentsLoading ? (
              // Loading skeleton for comments
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card p-6 rounded-2xl border animate-pulse"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-card p-6 rounded-2xl border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {comment.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= comment.rating ? "fill-orange text-orange" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
