import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  recipeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recipe', 
    required: true 
  },
  author: { 
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    username: String
  },
  rating: { 
    type: Number, 
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: { 
    type: String, 
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Review comment cannot exceed 1000 characters']
  },
  media: {
    images: [String]
  }
}, {
  timestamps: true
});

// Ensure one review per user per recipe
reviewSchema.index({ recipeId: 1, 'author.userId': 1 }, { unique: true });

// Update author username when saving
reviewSchema.pre('save', async function(next) {
  if (this.isNew && !this.author.username) {
    const User = mongoose.model('User');
    const user = await User.findById(this.author.userId);
    if (user) {
      this.author.username = user.username;
    }
  }
  next();
});

export default mongoose.model('Review', reviewSchema);