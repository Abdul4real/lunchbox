import "dotenv/config";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Recipe from "./models/Recipe.js";

await connectDB(process.env.MONGO_URI);
await Promise.all([User.deleteMany({}), Recipe.deleteMany({})]);

const admin = await User.create({ name: "Admin", email: "admin@demo.com", password: "Passw0rd!", role: "admin" });
const user  = await User.create({ name: "Johnson", email: "johnson@demo.com", password: "Passw0rd!", role: "user" });

await Recipe.create([
  { title: "Jollof Rice", time: "25 min", tags: ["Dinner","African"], author: user._id, status: "approved",
    ingredients: ["Rice","Tomatoes","Pepper","Stock"], steps: ["Prep","Sauce","Steam"], image: "/images/jollof.jpg" },
  { title: "Pasta Alfredo", time: "20 min", tags: ["Lunch","Italian"], author: user._id, status: "approved",
    ingredients: ["Pasta","Cream","Butter","Parmesan"], steps: ["Boil","Sauce","Combine"], image: "/images/alfredo.jpg" }
]);

console.log("✓ Seeded. Admin: admin@demo.com / Passw0rd!");
process.exit(0);