import React from "react";
import { Bell, Search, Menu } from "lucide-react";

export default function Header({
  activeTab,
  addToast,
  onMenuClick
}) {
  return (
    <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-600">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu />
          </button>

          <h1 className="text-xl font-semibold text-gray-200 capitalize">
            {activeTab}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 rounded-xl text-white border text-sm focus:ring-2 focus:ring-[#71BF44] outline-none"
            />
          </div>

          {/* Notifications */}
          <button
            onClick={() => addToast("No new notifications")}
            className="relative text-gray-600 hover:text-gray-900"
          >
            <Bell />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
