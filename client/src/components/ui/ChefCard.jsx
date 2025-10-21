import React from "react";
export default function ChefCard({ name, subtitle, role, avatar }) {
  return (
    <div className="flex items-center gap-3">
      <img src={avatar} alt={name} className="h-14 w-14 rounded-full object-cover" />
      <div>
        <p className="font-medium leading-tight">{name}</p>
        {subtitle && <p className="text-sm text-gray-500 dark:text-neutral-400 leading-tight">{subtitle}</p>}
        {role && <p className="text-xs text-gray-400 dark:text-neutral-500 leading-tight">{role}</p>}
      </div>
    </div>
  );
}