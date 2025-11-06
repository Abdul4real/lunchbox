import React from "react";
export default function KitchenCard({ title, image, tag }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-3">
        {tag && <span className="inline-block text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-full">{tag}</span>}
        <h4 className="mt-2 font-medium">{title}</h4>
      </div>
    </div>
  );
}