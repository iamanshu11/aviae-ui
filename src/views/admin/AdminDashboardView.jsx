import { useEffect, useState } from "react";
import {
  adminLogout,
  listPharmacistsAPI,
  listSymptomsAPI,
  listMedicationsAPI,
  listRedFlagsAPI,
  listConsultationsAPI,
} from "../../api-helpers/admin";

export default function AdminDashboardView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pharmacists, setPharmacists] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [redFlags, setRedFlags] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          pharmacistsData,
          symptomsData,
          medicationsData,
          redFlagsData,
          consultationsData,
        ] = await Promise.all([
          listPharmacistsAPI(),
          listSymptomsAPI(),
          listMedicationsAPI(),
          listRedFlagsAPI(),
          listConsultationsAPI(),
        ]);

        setPharmacists(pharmacistsData);
        setSymptoms(symptomsData);
        setMedications(medicationsData);
        setRedFlags(redFlagsData);
        setConsultations(consultationsData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.message || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    adminLogout();
    window.location.reload();
  };

  const StatCard = ({ icon, title, count, color, delay }) => (
    <div
      className="relative group h-full"
      style={{
        animation: `slideUp 0.6s ease-out ${delay}s both`,
      }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>
      <div className="relative h-full bg-slate-900 border border-slate-700 rounded-xl p-6 overflow-hidden group-hover:border-slate-600 transition-all duration-300 cursor-pointer group-hover:scale-105">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-start justify-between">
            <div className={`text-4xl`}>{icon}</div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center opacity-20 group-hover:opacity-40 transition-all duration-300`}></div>
          </div>

          <div>
            <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
            <div className="flex items-end gap-2">
              <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                {count}
              </p>
              <span className="text-xs text-slate-500 mb-1">total</span>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 w-0 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Loading Dashboard...
          </p>
          <p className="text-slate-400 mt-2">Fetching admin data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-6 relative">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-slate-900 border border-red-500/50 rounded-xl p-8 text-center backdrop-blur-xl">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Data</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,.05)_25%,rgba(168,85,247,.05)_50%,transparent_50%,transparent_75%,rgba(168,85,247,.05)_75%,rgba(168,85,247,.05))] bg-[length:40px_40px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-12">
          <div>
            <h1 className="text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 font-mono">&gt; System Status: All Systems Online</p>
          </div>

          <button
            onClick={handleLogout}
            className="group relative px-6 py-3 font-bold text-white overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              <span>Logout</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon="💊"
            title="Pharmacists"
            count={pharmacists.length}
            color="from-purple-600 to-blue-600"
            delay={0}
          />
          <StatCard
            icon="🩺"
            title="Symptoms"
            count={symptoms.length}
            color="from-pink-600 to-purple-600"
            delay={0.1}
          />
          <StatCard
            icon="💉"
            title="Medications"
            count={medications.length}
            color="from-blue-600 to-cyan-600"
            delay={0.2}
          />
          <StatCard
            icon="🚨"
            title="Red Flags"
            count={redFlags.length}
            color="from-red-600 to-pink-600"
            delay={0.3}
          />
          <StatCard
            icon="📞"
            title="Consultations"
            count={consultations.length}
            color="from-cyan-600 to-blue-600"
            delay={0.4}
          />
        </div>

        {/* Summary Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 group-hover:border-slate-600 transition-all duration-300">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📊</span>
                System Overview
              </h3>
              <div className="space-y-3 text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Total Entries</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {pharmacists.length + symptoms.length + medications.length + redFlags.length + consultations.length}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-purple-600/20 to-transparent"></div>
                <p className="text-sm">Active System Modules: 5</p>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 group-hover:border-slate-600 transition-all duration-300">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>✅</span>
                Status
              </h3>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>All Systems Operational</span>
                </div>
                <div className="h-px bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                <p className="text-sm">Last Updated: Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}