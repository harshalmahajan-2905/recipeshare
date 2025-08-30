import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  _id: string;
  recipe: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  authorName: string; // Denormalized for performance
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: [true, 'Recipe reference is required']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment author is required']
  },
  authorName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [5, 'Comment must be at least 5 characters long'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create indexes
CommentSchema.index({ recipe: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ isApproved: 1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
