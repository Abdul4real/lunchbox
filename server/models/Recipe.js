import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Ingredient name is required']
  },
  quantity: String,
  unit: String,
  notes: String
});

const instructionSchema = new mongoose.Schema({
  stepNumber: { 
    type: Number, 
    required: [true, 'Step number is required'],
    min: [1, 'Step number must be at least 1']
  },
  description: { 
    type: String, 
    required: [true, 'Step description is required']
  },
  duration: { type: Number, default: 0 },
  tips: String
});

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Recipe title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  author: { 
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    username: String
  },
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  media: {
    featuredImage: { type: String, required: true },
    images: [String],
    video: String
  },
  metadata: {
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'], 
      default: 'medium'
    },
    cuisineType: { type: String, required: true },
    dietaryTags: [String],
    mealType: [String],
    tags: [String]
  },
  stats: {
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'published' 
  }
}, {
  timestamps: true
});

// Virtual for total time
recipeSchema.virtual('metadata.totalTime').get(function() {
  return (this.metadata.prepTime || 0) + (this.metadata.cookTime || 0);
});

// Update author username when saving
recipeSchema.pre('save', async function(next) {
  if (this.isNew && !this.author.username) {
    const User = mongoose.model('User');
    const user = await User.findById(this.author.userId);
    if (user) {
      this.author.username = user.username;
    }
  }
  next();
});

// Indexes for performance
recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ 'metadata.cuisineType': 1 });
recipeSchema.index({ 'metadata.difficulty': 1 });
recipeSchema.index({ 'stats.averageRating': -1 });
recipeSchema.index({ 'stats.views': -1 });

export default mongoose.model('Recipe', recipeSchema);