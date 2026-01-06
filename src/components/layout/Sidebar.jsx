import React, { useState, useEffect } from "react";
import SidebarItem from "../common/SidebarItem";
import {
  Home,
  Users,
  FileText,
  ClipboardList,
  MessageSquare,
  User,
  LogOut,
  X,
  Shield
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  addToast
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [consultationStarted, setConsultationStarted] = useState(false);

  useEffect(() => {
    setConsultationStarted(!!localStorage.getItem("consultation_id"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("consultation_id");
    addToast("Logged out successfully", "success");
    window.location.href = "/";
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    // { id: "patients", label: "Patients", icon: <Users size={18} /> },
    { id: "records", label: "Consultations", icon: <FileText size={18} /> },
    {
      id: "begin-assessment",
      label: "Pre-Consultation",
      icon: <ClipboardList size={18} />,
      requiresConsultation: false
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: <MessageSquare size={18} />,
      requiresConsultation: true
    },
    { id: "profile", label: "Profile", icon: <User size={18} /> }
  ];

  const handleTabClick = (item) => {
    if (item.requiresConsultation && !consultationStarted) {
      addToast("Please start a consultation first", "error");
      return;
    }
    setActiveTab(item.id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-gray-800 border-r z-50 transform transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="Pharmbot Logo" className="h-8" />
            {/* <h2 className="text-2xl font-bold text-[#71BF44]">Pharmbot</h2> */}
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-red-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => handleTabClick(item)}
            />
          ))}
        </nav>

        {/* Profile / Bottom */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex-1 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#71BF44] text-white flex items-center justify-center font-bold">
                {(() => {
                  try {
                    const u = JSON.parse(localStorage.getItem('user') || '{}');
                    if (u && u.name) return u.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
                  } catch (e) { }
                  return 'DR';
                })()}
              </div>
              <div className="text-left">
                <p className="text-sm text-white font-semibold">{(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u && u.name ? u.name : 'Dr. Robert'; } catch (e) { return 'Dr. Robert'; } })()}</p>
                <p className="text-xs text-gray-200">{(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u && u.username ? u.username : 'Pharmacist'; } catch (e) { return 'Pharmacist'; } })()}</p>
              </div>
            </button>

            {/* Admin Button → separate page */}
            <button
              onClick={() => (window.location.href = "/admin")}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
              title="Admin Panel"
            >
              <Shield size={18} />
            </button>
          </div>

          {isProfileOpen && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
