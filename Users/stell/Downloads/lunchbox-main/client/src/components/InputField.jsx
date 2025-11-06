import React from "react";
export default function InputField({ label, type="text", name, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--lb-yellow)]"
      />
    </label>
  );
}