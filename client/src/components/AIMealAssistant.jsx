import React from "react";
export default function AIMealAssistant() {
  return (
    <aside className="h-fit sticky top-4 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-bold">AI Meal Assistant</h2>

      <div className="mt-3 rounded-xl bg-gray-50 p-4">
        <p className="font-semibold">Hey <b>User</b> 👋</p>
        <p className="text-sm text-gray-600 mt-1">
          here’s what you can make with your saved ingredients today!
        </p>
      </div>

      <button className="mt-4 w-full rounded-xl bg-black text-white py-2 font-semibold">
        Generate Meal Plan
      </button>

      <div className="mt-3 space-y-2">
        <button className="mt-4 w-full rounded-xl bg-black text-white py-2 font-semibold">
          Quick Recipes Under 15 Min
        </button>
        <button className="mt-4 w-full rounded-xl bg-black text-white py-2 font-semibold">
          Healthy Options
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-lg">My Kitchen</h3>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-sm font-semibold">Quick Recipes</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-sm font-semibold">Healthy Options</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 col-span-2">
            <p className="text-sm font-semibold">Comfort Food</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 col-span-2">
            <p className="text-sm font-semibold">Gluten-Free</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
