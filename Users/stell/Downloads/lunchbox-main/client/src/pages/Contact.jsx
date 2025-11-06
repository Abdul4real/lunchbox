import React from "react";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 dark:text-neutral-100">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "var(--lb-yellow)" }}>
            <span className="font-bold text-black">L</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contact Us</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Got a question, suggestion, or partnership idea? We’d love to hear from you.  
          Fill out the form below, and we’ll get back to you shortly.
        </p>
      </section>

      {/* Contact form */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 space-y-5 shadow-sm"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-[var(--lb-yellow)] outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-[var(--lb-yellow)] outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-[var(--lb-yellow)] outline-none"
                placeholder="Subject line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-[var(--lb-yellow)] outline-none"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Thank you! 🎉</h2>
            <p className="text-gray-600 dark:text-neutral-400">
              Your message has been received. Our team will get back to you soon.
            </p>
          </div>
        )}
      </section>

      {/* Contact info */}
      <section className="max-w-6xl mx-auto px-4 pb-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h3>
        <div className="flex flex-col md:flex-row justify-center gap-6 text-gray-700 dark:text-neutral-300">
          <div>
            <p className="font-semibold">📧 Email</p>
            <p className="text-sm">support@lunchbox.com</p>
          </div>
          <div>
            <p className="font-semibold">📍 Office</p>
            <p className="text-sm">123 Food Street, Toronto, ON</p>
          </div>
          <div>
            <p className="font-semibold">📞 Phone</p>
            <p className="text-sm">+1 (647) 555-0123</p>
          </div>
        </div>
      </section>
    </div>
  );
}

