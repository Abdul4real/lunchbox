import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

dotenv.config();

const sampleUsers = [
  {
    username: 'chef-maria',
    email: 'maria@email.com',
    password: 'password123',
    role: 'contributor',
    profile: {
      firstName: 'Maria',
      lastName: 'Garcia',
      bio: 'Professional chef specializing in Mediterranean cuisine',
      cuisineSpecialties: ['mediterranean', 'spanish', 'italian']
    }
  },
  {
    username: 'food-explorer',
    email: 'explorer@email.com',
    password: 'password123',
    profile: {
      firstName: 'Alex',
      lastName: 'Chen',
      bio: 'Food enthusiast exploring global cuisines',
      cuisineSpecialties: ['chinese', 'thai', 'japanese']
    }
  }
];

const sampleCategories = [
  {
    name: 'Italian',
    description: 'Classic Italian dishes from various regions',
    image: '/images/italian.jpg',
    tags: ['pasta', 'pizza', 'risotto']
  },
  {
    name: 'Mexican',
    description: 'Traditional and modern Mexican cuisine',
    image: '/images/mexican.jpg',
    tags: ['tacos', 'burritos', 'salsa']
  },
  {
    name: 'Asian',
    description: 'Diverse Asian culinary traditions',
    image: '/images/asian.jpg',
    tags: ['stir-fry', 'curry', 'noodles']
  },
  {
    name: 'Vegetarian',
    description: 'Plant-based recipes for every meal',
    image: '/images/vegetarian.jpg',
    tags: ['vegan', 'plant-based', 'healthy']
  }
];

const sampleRecipes = [
  {
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
    ingredients: [
      { name: 'Spaghetti', quantity: '400', unit: 'g' },
      { name: 'Pancetta', quantity: '150', unit: 'g' },
      { name: 'Eggs', quantity: '3', unit: 'large' },
      { name: 'Parmesan cheese', quantity: '100', unit: 'g' }
    ],
    instructions: [
      { stepNumber: 1, description: 'Cook spaghetti according to package instructions', duration: 10 },
      { stepNumber: 2, description: 'Fry pancetta until crispy', duration: 5 },
      { stepNumber: 3, description: 'Whisk eggs and Parmesan together', duration: 2 },
      { stepNumber: 4, description: 'Combine everything while pasta is hot', duration: 2 }
    ],
    metadata: {
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: 'easy',
      cuisineType: 'Italian',
      dietaryTags: ['non-vegetarian'],
      mealType: ['dinner'],
      tags: ['pasta', 'quick', 'comfort-food']
    }
  },
  {
    title: 'Vegetable Stir Fry',
    description: 'Quick and healthy vegetable stir fry with tofu',
    ingredients: [
      { name: 'Tofu', quantity: '200', unit: 'g' },
      { name: 'Bell peppers', quantity: '2', unit: 'large' },
      { name: 'Broccoli', quantity: '1', unit: 'head' },
      { name: 'Soy sauce', quantity: '3', unit: 'tbsp' }
    ],
    instructions: [
      { stepNumber: 1, description: 'Press and cube tofu', duration: 10 },
      { stepNumber: 2, description: 'Chop all vegetables', duration: 5 },
      { stepNumber: 3, description: 'Stir fry tofu until golden', duration: 5 },
      { stepNumber: 4, description: 'Add vegetables and sauce, cook until tender', duration: 8 }
    ],
    metadata: {
      prepTime: 15,
      cookTime: 13,
      servings: 3,
      difficulty: 'easy',
      cuisineType: 'Asian',
      dietaryTags: ['vegetarian', 'vegan'],
      mealType: ['dinner', 'lunch'],
      tags: ['quick', 'healthy', 'tofu']
    }
  }
];

const sampleReviews = [
  {
    rating: 5,
    comment: 'Absolutely delicious! The carbonara was creamy and perfect.'
  },
  {
    rating: 4,
    comment: 'Great stir fry recipe! I added some chili for extra spice.'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log('Created users');

    // Create categories
    const createdCategories = await Category.create(sampleCategories);
    console.log('Created categories');

    // Create recipes with actual user IDs
    const recipesWithAuthors = sampleRecipes.map((recipe, index) => ({
      ...recipe,
      author: {
        userId: createdUsers[index % createdUsers.length]._id,
        username: createdUsers[index % createdUsers.length].username
      }
    }));

    const createdRecipes = await Recipe.create(recipesWithAuthors);
    console.log('Created recipes');

    // Create reviews
    const reviewsWithAuthors = sampleReviews.map((review, index) => ({
      ...review,
      recipeId: createdRecipes[index]._id,
      author: {
        userId: createdUsers[(index + 1) % createdUsers.length]._id,
        username: createdUsers[(index + 1) % createdUsers.length].username
      }
    }));

    await Review.create(reviewsWithAuthors);
    console.log('Created reviews');

    // Update user stats
    for (const user of createdUsers) {
      const recipeCount = await Recipe.countDocuments({ 'author.userId': user._id });
      const reviewCount = await Review.countDocuments({ 'author.userId': user._id });
      
      user.stats.recipesCreated = recipeCount;
      user.stats.reviewsWritten = reviewCount;
      await user.save();
    }

    // Update category counts
    for (const category of createdCategories) {
      const count = await Recipe.countDocuments({
        'metadata.cuisineType': category.name
      });
      category.recipeCount = count;
      await category.save();
    }

    console.log('Database seeded successfully');
    console.log(`Created: ${createdUsers.length} users, ${createdRecipes.length} recipes, ${createdCategories.length} categories`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

