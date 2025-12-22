import React from "react";

export default function SidebarItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
        ${isActive
          ? "bg-[#569732] text-white shadow"
          : "text-gray-100 hover:bg-[#63AD3A]"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
