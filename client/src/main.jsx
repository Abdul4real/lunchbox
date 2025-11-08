import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import SignIn from "./pages/SignIn.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import "./index.css";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminRecipes from "./pages/admin/AdminRecipes.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import AuthProvider from "./contexts/AuthContext";

import UserRoute from "./routes/UserRoute.jsx";
import UserLayout from "./components/user/UserLayout.jsx";
import UserHome from "./pages/app/UserHome.jsx";
import AddRecipe from "./pages/app/AddRecipe.jsx";
import RecipeDetails from "./pages/app/RecipeDetails.jsx";
import EditRecipe from "./pages/app/EditRecipe.jsx";
//import SearchRecipes from "./pages/app/SearchRecipes.jsx";
//import Profile from "./pages/app/Profile.jsx";
import RecipesProvider from "./contexts/RecipesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <RecipesProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        {/* admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="recipes" element={<AdminRecipes />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>
          </Route>
          {/* Protected user app */}
        <Route element={<UserRoute />}>
          <Route path="/app" element={<UserLayout />}>
            <Route index element={<UserHome />} />
            <Route path="add" element={<AddRecipe />} />
            <Route path="recipe/:id" element={<RecipeDetails />} /> 
            <Route path="recipe/:id/edit" element={<EditRecipe />} />
          </Route>
        </Route>
      </Routes>
      </RecipesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
