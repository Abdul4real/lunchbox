import React from "react";
import { createContext, useContext, useMemo, useState } from "react";

const RecipesContext = createContext();
export const useRecipes = () => useContext(RecipesContext);

const seed = [
  { id: 101, title: "Jollof Rice", time: "25 min", image: "/images/jollof.jpg",
    ingredients: ["Rice","Tomato","Pepper","Stock"], steps: ["Prep","Cook sauce","Steam rice"], rating: 4.8,
    bookmarks: 0, tags: ["Dinner","African"], reviews: [{by:"Lila",stars:5,text:"So good!"}] },
  { id: 102, title: "Pasta Alfredo", time: "20 min", image: "/images/alfredo.jpg",
    ingredients: ["Pasta","Cream","Parmesan","Butter"], steps: ["Boil pasta","Make sauce","Combine"], rating: 4.7,
    bookmarks: 0, tags: ["Lunch","Italian"], reviews: [] },
    { id: 102, title: "Pasta Alfredo", time: "20 min", image: "/images/alfredo.jpg",
    ingredients: ["Pasta","Cream","Parmesan","Butter"], steps: ["Boil pasta","Make sauce","Combine"], rating: 4.7,
    bookmarks: 0, tags: ["Lunch","Italian"], reviews: [] },
    { id: 103, title: "Sushi Rolls", time: "40 min", image: "/images/sushi.jpg",bookmarked:true,
    ingredients: ["Sushi Rice","Nori","Fish","Vegetables"], steps: ["Prepare rice","Assemble rolls","Slice"], rating: 4.9,
    bookmarks: 1, tags: ["Dinner","Japanese"], reviews: [{by:"Kenji",stars:5,text:"Authentic taste!"}] },
    { id: 104, title: "Tacos", time: "15 min", image: "/images/tacos.jpg",bookmarked:true,
    ingredients: ["Tortillas","Meat","Lettuce","Cheese"], steps: ["Cook meat","Assemble tacos"], rating: 4.6,
    bookmarks: 1, tags: ["Lunch","Mexican"], reviews: [{by:"Maria",stars:4,text:"Very tasty!"}] },
    { id: 105, title: "Caesar Salad", time: "10 min", image: "/images/caesar.jpg",
    ingredients: ["Romaine Lettuce","Croutons","Caesar Dressing","Parmesan"], steps: ["Chop lettuce","Add toppings","Toss"], rating: 4.5,
    bookmarks: 0, tags: ["Salad","Appetizer"], reviews: [] },
    
];

export default function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState(seed);

  const addRecipe = (r) =>
    setRecipes(rs => [{ ...r, id: Date.now(), reviews: [], bookmarks: 0, rating: 0 }, ...rs]);

  const updateRecipe = (id, patch) =>
    setRecipes(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const deleteRecipe = (id) =>
    setRecipes(rs => rs.filter(r => r.id !== id));

  const addReview = (id, review) =>
    setRecipes(rs => rs.map(r => r.id === id ? { ...r, reviews: [review, ...r.reviews] } : r));

  const toggleBookmark = (id) =>
    setRecipes(rs => rs.map(r => r.id === id ? { ...r, bookmarks: (r.bookmarked ? r.bookmarks - 1 : r.bookmarks + 1), bookmarked: !r.bookmarked } : r));

  const value = useMemo(() => ({ recipes, addRecipe, updateRecipe, deleteRecipe, addReview, toggleBookmark }), [recipes]);
  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}
