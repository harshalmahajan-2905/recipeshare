import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  ChefHat,
  Heart,
  Settings,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { Recipe } from "@shared/api";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Initialize edit form with user data
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Fetch user's recipes and favorites
  useEffect(() => {
    if (user) {
      fetchUserRecipes();
      fetchFavoriteRecipes();
    }
  }, [user]);

  const fetchUserRecipes = async () => {
    try {
      // For now, we'll mock this since we don't have user-recipe relationships yet
      // In a real app, you'd fetch recipes where authorId === user.id
      setUserRecipes([]);
    } catch (error) {
      console.error("Failed to fetch user recipes:", error);
    }
  };

  const fetchFavoriteRecipes = async () => {
    try {
      // For now, we'll mock this since we don't have favorites implemented yet
      setFavoriteRecipes([]);
    } catch (error) {
      console.error("Failed to fetch favorite recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement profile update API call
      console.log("Saving profile:", editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) {
    return null;
  }

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
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-orange text-white text-2xl font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          className="bg-orange hover:bg-orange/90"
                        >
                          Save Changes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="font-display font-bold text-3xl text-foreground">
                          {user.name}
                        </h1>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Edit Profile
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-6 mt-4">
                        <div className="text-center">
                          <div className="font-bold text-2xl text-foreground">
                            {userRecipes.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Recipes Shared
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-2xl text-foreground">
                            {favoriteRecipes.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Favorites
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-2xl text-foreground">
                            42
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Reviews Given
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="recipes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="recipes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5" />
                    My Recipes
                  </CardTitle>
                  <CardDescription>
                    Recipes you've shared with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userRecipes.length === 0 ? (
                    <div className="text-center py-12">
                      <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-xl text-foreground mb-2">
                        No recipes yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Share your first recipe with the community!
                      </p>
                      <Button className="bg-orange hover:bg-orange/90">
                        Share a Recipe
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="bg-card rounded-lg border p-4"
                        >
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold mb-2">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {recipe.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>⭐ {recipe.rating}</span>
                            <span>{recipe.reviewCount} reviews</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Favorite Recipes
                  </CardTitle>
                  <CardDescription>
                    Recipes you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteRecipes.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-xl text-foreground mb-2">
                        No favorites yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start exploring recipes and save your favorites!
                      </p>
                      <Button variant="outline" onClick={() => navigate("/")}>
                        Browse Recipes
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="bg-card rounded-lg border p-4"
                        >
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold mb-2">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {recipe.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>⭐ {recipe.rating}</span>
                            <span>{recipe.reviewCount} reviews</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                  <CardDescription>
                    Reviews and ratings you've given
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-xl text-foreground mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted-foreground">
                      Try some recipes and share your experience!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
