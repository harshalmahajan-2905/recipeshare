import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  steps: [{ type: String, required: true }],
  imageUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
  ratings: [ratingSchema],
}, { timestamps: true });

recipeSchema.virtual('avgRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((a, r) => a + r.value, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

export default mongoose.model('Recipe', recipeSchema);
