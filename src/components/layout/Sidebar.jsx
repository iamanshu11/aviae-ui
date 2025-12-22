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
  Plus,
  AlertCircle,
  Shield,
  Lock
} from "lucide-react";
import { createPharmacist, adminLogin, isAdminAuthenticated as checkAdminAuth, adminLogout } from "../../api-helpers/admin";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  addToast
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoginLoading, setIsAdminLoginLoading] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gphc_number: '',
    pharmacy_ods_code: '',
    password: ''
  });
  const [consultationStarted, setConsultationStarted] = useState(false);

  useEffect(() => {
    setIsAdminAuthenticated(checkAdminAuth());
    // Check if a consultation has started
    setConsultationStarted(!!localStorage.getItem("consultation_id"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('consultation_id'); // clear consultation
    addToast("Logged out successfully", "success");
    window.location.href = '/login';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) { addToast("Please enter admin key", "error"); return; }
    setIsAdminLoginLoading(true);
    const result = await adminLogin(adminKey);
    setIsAdminLoginLoading(false);
    if (result.success) {
      setIsAdminAuthenticated(true);
      setIsAdminLoginOpen(false);
      setAdminKey('');
      addToast("Admin login successful", "success");
    } else {
      addToast(result.error || "Invalid admin credentials", "error");
    }
  };

  const handleAdminLogout = () => {
    adminLogout();
    setIsAdminAuthenticated(false);
    setIsModalOpen(false);
    addToast("Admin logged out", "success");
  };

  const handleCreatePharmacist = async (e) => {
    e.preventDefault();
    if (!checkAdminAuth()) {
      addToast("Admin authentication required", "error");
      setIsAdminLoginOpen(true);
      setIsModalOpen(false);
      return;
    }
    if (!formData.name || !formData.gphc_number || !formData.pharmacy_ods_code || !formData.password) {
      addToast("All fields are required", "error");
      return;
    }
    setIsLoading(true);
    try {
      const result = await createPharmacist(formData);
      addToast(`Pharmacist "${result.name}" created successfully!`, "success");
      setFormData({ name: '', gphc_number: '', pharmacy_ods_code: '', password: '' });
      setIsModalOpen(false);
    } catch (error) {
      addToast(`Error: ${error.message}`, "error");
      if (error.message.includes('authentication')) handleAdminLogout();
    } finally { setIsLoading(false); }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "patients", label: "Patients", icon: <Users size={18} /> },
    { id: "records", label: "Consultations", icon: <FileText size={18} /> },
    { id: "begin-assessment", label: "Pre-Consultation", icon: <ClipboardList size={18} />, requiresConsultation: false },
    { id: "chat", label: "AI Chat", icon: <MessageSquare size={18} />, requiresConsultation: true },
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
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-72 bg-gray-800 border-r z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b">
          <div className="flex items-center gap-3">
            <img src="/img/logo.svg" alt="Pharmbot Logo" className="h-8" />
            <h2 className="text-2xl font-bold text-[#71BF44]">Pharmbot</h2>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-red-400" onClick={() => setIsMobileMenuOpen(false)}>
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => handleTabClick(item)}
            />
          ))}
        </nav>

        {/* Profile */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#71BF44] text-white flex items-center justify-center font-bold">DR</div>
              <div className="text-left">
                <p className="text-sm text-white font-semibold">Dr. Robert</p>
                <p className="text-xs text-gray-200">General Physician</p>
              </div>
            </button>

            <button
              onClick={() => isAdminAuthenticated ? handleAdminLogout() : setIsAdminLoginOpen(true)}
              className={`p-2 rounded-lg transition ${isAdminAuthenticated ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title={isAdminAuthenticated ? "Admin Logout" : "Admin Login"}
            >
              <Shield size={18} />
            </button>

            {isAdminAuthenticated && (
              <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-lg bg-[#71BF44] text-white hover:bg-green-600 transition" title="Create Pharmacist">
                <Plus size={18} />
              </button>
            )}
          </div>

          {isProfileOpen && (
            <button onClick={handleLogout} className="mt-4 w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50">
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </aside>


      {/* Admin Login Modal */}
      {isAdminLoginOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield size={24} className="text-purple-500" />
                <h3 className="text-xl font-bold text-white">Admin Login</h3>
              </div>
              <button
                onClick={() => {
                  setIsAdminLoginOpen(false);
                  setAdminKey('');
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Admin Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key"
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Only authorized administrators can create new pharmacists
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminLoginOpen(false);
                    setAdminKey('');
                  }}
                  disabled={isAdminLoginLoading}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdminLoginLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {isAdminLoginLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Pharmacist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle size={24} className="text-[#71BF44]" />
                <h3 className="text-xl font-bold text-white">Create Pharmacist</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePharmacist} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Test Pharmacist"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#71BF44]"
                />
              </div>

              {/* GPHC Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  GPHC Number
                </label>
                <input
                  type="text"
                  name="gphc_number"
                  value={formData.gphc_number}
                  onChange={handleInputChange}
                  placeholder="e.g., GPHC0001"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#71BF44]"
                />
              </div>

              {/* Pharmacy ODS Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Pharmacy ODS Code
                </label>
                <input
                  type="text"
                  name="pharmacy_ods_code"
                  value={formData.pharmacy_ods_code}
                  onChange={handleInputChange}
                  placeholder="e.g., ODS123"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#71BF44]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#71BF44]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#71BF44] text-white font-semibold hover:bg-green-600 disabled:opacity-50 transition"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}