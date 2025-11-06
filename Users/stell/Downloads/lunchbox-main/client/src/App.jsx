import React from "react";
import Header from "./components/Header";
import FeaturedRecipes from "./components/FeaturedRecipes";
import AIMealAssistant from "./components/AIMealAssistant";
import PopularChefs from "./components/PopularChefs";
import MyKitchen from "./components/MyKitchen";
import Footer from "./components/Footer";

import ThemeProvider from "./contexts/ThemeContext";
import NotificationsProvider from "./contexts/NotificationsContext";

export default function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <main className="max-w-7xl mx-auto px-4 lg:px-6 bg-white dark:bg-neutral-950 dark:text-neutral-100">
          <Header />
          <section className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6 mt-6">
            <FeaturedRecipes />
            <AIMealAssistant />
          </section>
          <PopularChefs />
          <MyKitchen />
          <Footer />
        </main>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
