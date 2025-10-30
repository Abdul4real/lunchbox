import React from "react";
<<<<<<< HEAD

const About = () => {
  return (
    <div className="about-page max-w-5xl mx-auto px-6 py-12 text-gray-800 dark:text-neutral-100 leading-relaxed">
      {/* Header */}
      <header className="about-header text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          🍽️ Welcome to Lunchbox: Recipe Sharing, Reimagined
        </h1>
        <p className="text-lg text-gray-600 dark:text-neutral-300">
          <strong>Lunchbox</strong> is a community-driven platform built for
          food enthusiasts tired of cluttered, ad-heavy recipe sites. We connect
          food lovers in a clean, inclusive, and engaging space to explore,
          share, and celebrate global cuisine.
        </p>
      </header>

      <hr className="border-gray-300 dark:border-neutral-700 my-10" />

      {/* Vision & Mission */}
      <section className="about-section vision-mission mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          🌟 Our Vision & Business Need
        </h2>
        <div className="space-y-4 text-lg text-gray-700 dark:text-neutral-300">
          <p>
            Current recipe platforms are often broken—littered with paywalls,
            invasive ads, and lacking strong community features. Our vision is
            to address this by building a{" "}
            <strong>world-class, high-performing, and culturally inclusive platform</strong>{" "}
            that truly puts the user first.
          </p>
          <p>
            Lunchbox celebrates <strong>cultural diversity</strong> by providing
            a space for recipes from every corner of the world, making it a
            vibrant hub for learning new techniques and discovering diverse
            cuisines.
          </p>
        </div>
      </section>

      <hr className="border-gray-300 dark:border-neutral-700 my-10" />

      {/* Why Choose */}
      <section className="about-section benefits mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          🚀 Why Choose Lunchbox?
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-lg text-gray-700 dark:text-neutral-300">
          <li>
            <strong>Cleaner, Ad-Light Experience:</strong> Say goodbye to
            constant interruptions. We focus on just recipes and the people
            sharing them.
          </li>
          <li>
            <strong>Inclusive & Diverse:</strong> Post and explore recipes from{" "}
            <em>any culture</em>. Our platform is designed to celebrate food
            from around the globe.
          </li>
          <li>
            <strong>Community-Driven Engagement:</strong> Our integrated rating,
            review, and profile systems encourage genuine connection and
            sharing, moving beyond passive browsing.
          </li>
          <li>
            <strong>Future-Ready Technology:</strong> Built with a scalable
            architecture, ready for rich media (photos/videos) and push
            notifications as our community grows.
          </li>
        </ul>
      </section>

      <hr className="border-gray-300 dark:border-neutral-700 my-10" />

      {/* Commitments */}
      <section className="about-section success">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          📈 Our Commitments to Quality
        </h2>
        <p className="text-lg mb-4 text-gray-700 dark:text-neutral-300">
          We are committed to delivering a reliable, efficient, and accessible
          user experience. Our internal objectives guide our development:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg text-gray-700 dark:text-neutral-300">
          <li>
            <strong>Quality:</strong> Achieving <strong>85%+</strong> across
            Lighthouse audits for performance and accessibility.
          </li>
          <li>
            <strong>Reliability:</strong> Ensuring all core features (sign-up /
            login, recipe management, search) pass acceptance testing
            flawlessly.
          </li>
          <li>
            <strong>Community Growth:</strong> Fostering an active community
            with a high percentage of users as{" "}
            <strong>active contributors</strong> of recipes or reviews.
          </li>
        </ul>
      </section>

      {/* Footer text */}
      <footer className="text-center mt-16 text-gray-500 dark:text-neutral-500">
        <p>© 2025 Lunchbox. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default About;
=======
export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 dark:text-neutral-100">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "var(--lb-yellow)" }}>
            <span className="font-bold text-black">L</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">About LunchBox</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-3xl">
          LunchBox helps home cooks discover recipes they’ll love, plan meals with ease, and shop smarter. 
          Built for speed, simplicity, and delight — in light and dark mode.
        </p>
      </section>

      {/* Mission + Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="mt-3 text-gray-600 dark:text-neutral-400">
              Make cooking joyful and accessible. From Jollof to Buddha Bowls, from 10-minute bites to weekend feasts —
              LunchBox brings together curated recipes, AI suggestions, and a smart kitchen dashboard that fits your day.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { k: "2k+", v: "Recipes" },
              { k: "120+", v: "Chefs" },
              { k: "98%", v: "User Satisfaction" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 text-center">
                <p className="text-3xl font-extrabold">{s.k}</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values / Features */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold">What We Value</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: "Simplicity",
              text: "Clean UI, fast interactions, no clutter. Find, plan, and cook without friction."
            },
            {
              title: "Personalization",
              text: "AI Meal Assistant learns your tastes, pantry, and schedule to recommend better meals."
            },
            {
              title: "Community",
              text: "Follow chefs, share tips, and review recipes to help others cook with confidence."
            },
          ].map((v, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
              <h4 className="font-semibold">{v.title}</h4>
              <p className="mt-2 text-gray-600 dark:text-neutral-400">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold">Meet the Team</h3>
        <p className="text-gray-600 dark:text-neutral-400 mt-2">Food lovers, builders, and design nerds.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {[
            { name: "Lila Owens", role: "Product Lead", img: "/images/chef1.jpg" },
            { name: "Noah Foster", role: "Engineering", img: "/images/chef3.jpg" },
            { name: "Sophia Turner", role: "Culinary Curation", img: "/images/chef4.jpg" },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
              <img src={t.img} alt={t.name} className="h-16 w-16 rounded-full object-cover" />
              <p className="mt-3 font-medium">{t.name}</p>
              <p className="text-sm text-gray-600 dark:text-neutral-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold">Our Journey</h3>
        <ol className="mt-6 space-y-4">
          {[
            { year: "2024", text: "Prototype launched with recipe search + favorites." },
            { year: "2025", text: "AI Meal Assistant, Meal Planner, and Grocery List go live." },
            { year: "Next", text: "Cook-Along Mode with timers & voice guidance." },
          ].map((e, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-[var(--lb-yellow)]" />
              <div>
                <p className="font-semibold">{e.year}</p>
                <p className="text-gray-600 dark:text-neutral-400">{e.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold">FAQ</h3>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[
            { q: "Is LunchBox free?", a: "Yes. Core features are free. Premium adds advanced meal plans and nutrition insights." },
            { q: "Do you support dark mode?", a: "Absolutely. Your theme preference is saved automatically." },
            { q: "Can I share my own recipes?", a: "Yes — upload in My Kitchen › Add Recipe. Photos recommended." },
            { q: "Which platforms are supported?", a: "Modern browsers on desktop/mobile. Native apps are on our roadmap." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
              <p className="font-medium">{f.q}</p>
              <p className="mt-1 text-gray-600 dark:text-neutral-400">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Ready to cook smarter?</h3>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">Create an account to save recipes, plan meals, and sync your grocery list.</p>
          </div>
          <div className="flex gap-3">
            <a href="/register" className="px-4 py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black hover:opacity-90">Get Started</a>
            <a href="/signin" className="px-4 py-2 rounded-xl border border-gray-200 dark:border-neutral-700">Sign In</a>
          </div>
        </div>
      </section>
    </div>
  );
}
>>>>>>> 79de5346bd449f1c2679fa23f09eeefe21bacd4b
