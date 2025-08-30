import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Minus, ChefHat, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth, getAuthHeaders } from "../contexts/AuthContext";
import { CreateRecipeRequest } from "@shared/api";

interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    imagePublicId: "",
    cookTime: "",
    prepTime: "",
    servings: 4,
    category: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    tags: [] as string[],
    ingredients: [""],
    instructions: [""],
    nutrition: null as NutritionInfo | null,
    tips: [""]
  });
  
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const categories = [
    "Breakfast", "Lunch", "Dinner", "Dessert", 
    "Snacks", "Beverages", "Appetizers"
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setImageUploading(true);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formDataUpload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setFormData(prev => ({
        ...prev,
        image: data.image.url,
        imagePublicId: data.image.publicId
      }));
      setImagePreview(data.image.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Add/remove ingredient
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  // Add/remove instruction
  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  // Add/remove tip
  const addTip = () => {
    setFormData(prev => ({
      ...prev,
      tips: [...prev.tips, ""]
    }));
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };

  const updateTip = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.map((tip, i) => i === index ? value : tip)
    }));
  };

  // Handle tag addition
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Recipe title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.image) return "Recipe image is required";
    if (!formData.cookTime.trim()) return "Cook time is required";
    if (!formData.prepTime.trim()) return "Prep time is required";
    if (!formData.category) return "Category is required";
    if (formData.ingredients.filter(ing => ing.trim()).length === 0) return "At least one ingredient is required";
    if (formData.instructions.filter(inst => inst.trim()).length === 0) return "At least one instruction is required";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recipeData: CreateRecipeRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image,
        cookTime: formData.cookTime.trim(),
        prepTime: formData.prepTime.trim(),
        servings: formData.servings,
        category: formData.category,
        difficulty: formData.difficulty,
        tags: formData.tags,
        ingredients: formData.ingredients.filter(ing => ing.trim()),
        instructions: formData.instructions.filter(inst => inst.trim()),
        nutrition: formData.nutrition,
        tips: formData.tips.filter(tip => tip.trim())
      };

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(recipeData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create recipe');
      }

      // Redirect to the new recipe
      navigate(`/recipe/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Recipes
              </Button>
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-orange" />
                <span className="font-display font-bold text-xl text-warm-gray">RecipeShare</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Creating as {user?.name}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display font-bold text-4xl text-foreground mb-2">Share Your Recipe</h1>
            <p className="text-lg text-muted-foreground">
              Share your favorite recipe with the RecipeShare community
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about your recipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Grandma's Chocolate Chip Cookies"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us what makes this recipe special..."
                    maxLength={500}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select value={formData.difficulty} onValueChange={(value: "Easy" | "Medium" | "Hard") => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="servings">Servings *</Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      max="50"
                      value={formData.servings}
                      onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prepTime">Prep Time *</Label>
                    <Input
                      id="prepTime"
                      value={formData.prepTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, prepTime: e.target.value }))}
                      placeholder="e.g., 15 min"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cookTime">Cook Time *</Label>
                    <Input
                      id="cookTime"
                      value={formData.cookTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, cookTime: e.target.value }))}
                      placeholder="e.g., 30 min"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Photo *</CardTitle>
                <CardDescription>Upload a delicious photo of your finished dish</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Recipe preview" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: "", imagePublicId: "" }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Upload Recipe Photo</h3>
                      <p className="text-muted-foreground mb-4">
                        Choose a high-quality photo of your finished dish
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="gap-2"
                      >
                        {imageUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Choose Photo
                          </>
                        )}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Supports JPG, PNG, WebP (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Add tags to help others find your recipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., spicy, vegetarian)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients *</CardTitle>
                <CardDescription>List all ingredients needed for this recipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1} (e.g., 2 cups all-purpose flour)`}
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addIngredient} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Ingredient
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions *</CardTitle>
                <CardDescription>Step-by-step cooking instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-2">
                        {index + 1}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          placeholder={`Step ${index + 1} instructions...`}
                          className="min-h-[80px]"
                        />
                        {formData.instructions.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeInstruction(index)}
                            className="mt-2"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addInstruction} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Step
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Pro Tips</CardTitle>
                <CardDescription>Share helpful tips for making this recipe (optional)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.tips.map((tip, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={tip}
                        onChange={(e) => updateTip(index, e.target.value)}
                        placeholder="Share a helpful tip..."
                        className="min-h-[60px]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTip(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addTip} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Tip
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || imageUploading}
                className="bg-orange hover:bg-orange/90 flex-1 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing Recipe...
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    Publish Recipe
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
