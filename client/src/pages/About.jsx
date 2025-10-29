import React from "react";

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
