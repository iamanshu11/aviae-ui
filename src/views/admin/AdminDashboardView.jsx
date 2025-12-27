import { useEffect, useState } from "react";
import {
  adminLogout,
  listPharmacistsAPI,
  listSymptomsAPI,
  listMedicationsAPI,
  listRedFlagsAPI,
  listConsultationsAPI,
  deletePharmacistAPI,
} from "../../api-helpers/admin";
import CreatePharmacistModal from './CreatePharmacistModal';
import SymptomModal from './SymptomModal';
import MedicationModal from './MedicationModal';
import RedFlagModal from './RedFlagModal';
import { deleteSymptomAPI, deleteMedicationAPI, deleteRedFlagAPI } from '../../api-helpers/admin';

export default function AdminDashboardView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pharmacists, setPharmacists] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [redFlags, setRedFlags] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showSymptom, setShowSymptom] = useState(false);
  const [showMedication, setShowMedication] = useState(false);
  const [showRedFlag, setShowRedFlag] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  const [editingRedFlag, setEditingRedFlag] = useState(null);
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

  const refresh = async () => {
    try {
      const pharmacistsData = await listPharmacistsAPI();
      setPharmacists(pharmacistsData);
    } catch (e) {
      console.error(e);
    }
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

          {/* header controls removed for compact UI; logout is floating */}
          <div className="hidden"></div>
          <button onClick={() => setShowCreate(true)} className="ml-3 group relative px-6 py-3 font-bold text-white overflow-hidden rounded-lg bg-purple-600">Add Pharmacist</button>
        </div>


      </div>

      {/* Floating logout (compact) */} 
      <button onClick={handleLogout} className="fixed left-4 bottom-6 z-50 bg-red-600 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-2xl">Logout</button>

      {showCreate && (
        <CreatePharmacistModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            refresh();
          }}
          initial={showCreate && showCreate.pharmacist ? showCreate.pharmacist : null}
        />
      )}

      {showSymptom && (
        <SymptomModal
          initial={editingSymptom}
          onClose={() => { setShowSymptom(false); setEditingSymptom(null); }}
          onSaved={async () => { const newList = await listSymptomsAPI(); setSymptoms(newList); }}
        />
      )}

      {showMedication && (
        <MedicationModal
          initial={editingMedication}
          onClose={() => { setShowMedication(false); setEditingMedication(null); }}
          onSaved={async () => { const newList = await listMedicationsAPI(); setMedications(newList); }}
        />
      )}

      {showRedFlag && (
        <RedFlagModal
          initial={editingRedFlag}
          onClose={() => { setShowRedFlag(false); setEditingRedFlag(null); }}
          onSaved={async () => { const newList = await listRedFlagsAPI(); setRedFlags(newList); }}
        />
      )}
      {/* Lists */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <h4 className="text-lg font-bold mb-3">Pharmacists</h4>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 text-xs uppercase">
                <tr><th>Name</th><th>Username</th><th>Email</th><th>GPHC</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {pharmacists.map((p) => (
                  <tr key={p.id} className="border-t border-slate-800">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.username || '-'}</td>
                    <td className="py-2">{p.email || '-'}</td>
                    <td className="py-2">{p.gphc_number}</td>
                    <td className="py-2 text-right">
                      <button onClick={() => setShowCreate({ edit: true, pharmacist: p })} className="text-xs px-2 py-1 bg-purple-600 rounded text-white mr-2">Edit</button>
                      <button onClick={async () => { if (confirm('Delete this pharmacist?')) { try { await deletePharmacistAPI(p.id); await refresh(); } catch (err) { console.error(err); alert('Delete failed'); } } }} className="text-xs px-2 py-1 bg-red-600 rounded text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold">Symptoms</h4>
            <div>
              <button onClick={() => { setEditingSymptom(null); setShowSymptom(true); }} className="text-xs px-2 py-1 bg-green-600 rounded text-white mr-2">Add</button>
            </div>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 text-xs uppercase"><tr><th>Symptom</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {symptoms.map(s => (<tr key={s.id} className="border-t border-slate-800"><td className="py-2">{s.symptom_text}</td><td className="py-2 text-right"><button onClick={() => { setEditingSymptom(s); setShowSymptom(true); }} className="text-xs px-2 py-1 bg-purple-600 rounded text-white mr-2">Edit</button><button onClick={async () => { if (confirm('Delete this symptom?')) { try { await deleteSymptomAPI(s.id); const newList = await listSymptomsAPI(); setSymptoms(newList); } catch (err) { console.error(err); alert('Delete failed'); } } }} className="text-xs px-2 py-1 bg-red-600 rounded text-white">Delete</button></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold">Medications</h4>
            <div>
              <button onClick={() => { setEditingMedication(null); setShowMedication(true); }} className="text-xs px-2 py-1 bg-green-600 rounded text-white mr-2">Add</button>
            </div>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 text-xs uppercase"><tr><th>Drug</th><th>First line</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {medications.map(m => (<tr key={m.id} className="border-t border-slate-800"><td className="py-2">{m.drug_name}</td><td className="py-2">{m.is_first_line ? 'Yes' : 'No'}</td><td className="py-2 text-right"><button onClick={() => { setEditingMedication(m); setShowMedication(true); }} className="text-xs px-2 py-1 bg-purple-600 rounded text-white mr-2">Edit</button><button onClick={async () => { if (confirm('Delete this medication?')) { try { await deleteMedicationAPI(m.id); const newList = await listMedicationsAPI(); setMedications(newList); } catch (err) { console.error(err); alert('Delete failed'); } } }} className="text-xs px-2 py-1 bg-red-600 rounded text-white">Delete</button></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold">Red Flags</h4>
            <div>
              <button onClick={() => { setEditingRedFlag(null); setShowRedFlag(true); }} className="text-xs px-2 py-1 bg-green-600 rounded text-white mr-2">Add</button>
            </div>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 text-xs uppercase"><tr><th>Code</th><th>Question</th><th>Severity</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {redFlags.map(r => (<tr key={r.id} className="border-t border-slate-800"><td className="py-2">{r.question_code}</td><td className="py-2">{r.question_text}</td><td className="py-2">{r.severity}</td><td className="py-2 text-right"><button onClick={() => { setEditingRedFlag(r); setShowRedFlag(true); }} className="text-xs px-2 py-1 bg-purple-600 rounded text-white mr-2">Edit</button><button onClick={async () => { if (confirm('Delete this red flag?')) { try { await deleteRedFlagAPI(r.id); const newList = await listRedFlagsAPI(); setRedFlags(newList); } catch (err) { console.error(err); alert('Delete failed'); } } }} className="text-xs px-2 py-1 bg-red-600 rounded text-white">Delete</button></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 lg:col-span-2">
          <h4 className="text-lg font-bold mb-3">Consultations</h4>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 text-xs uppercase"><tr><th>Ref</th><th>Pharmacist</th><th>Status</th><th>Started</th></tr></thead>
              <tbody>
                {(Array.isArray(consultations) ? consultations : []).map(c => (
                  <tr key={c.id} className="border-t border-slate-800">
                    <td className="py-2">{c.consultation_ref}</td>
                    <td className="py-2">{c.pharmacist_id}</td>
                    <td className="py-2">{c.status}</td>
                    <td className="py-2">{c.started_at ? new Date(c.started_at).toLocaleString() : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}