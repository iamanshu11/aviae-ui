import React, { useEffect, useState } from "react";
import { Filter, Download } from "lucide-react";
import ConsultationModal from "../components/modals/ConsultationModal";
import { listConsultationsAPI } from "../api-helpers/admin";

const ConsultationRecordsView = ({ addToast }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsult, setSelectedConsult] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?.id) {
          setConsultations([]);
          return;
        }

        const allConsultations = await listConsultationsAPI();

        // 🔒 Show only logged-in pharmacist’s consultations
        const userConsultations = allConsultations.filter(
          (c) => c.pharmacist_id === user.id
        );

        setConsultations(userConsultations);
      } catch (err) {
        console.error("Failed to load consultations", err);
        addToast?.("Failed to load consultation records", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  if (loading) {
    return <p className="text-slate-400">Loading consultation records...</p>;
  }

  return (
    <div className="space-y-6">
      <ConsultationModal
        isOpen={!!selectedConsult}
        onClose={() => setSelectedConsult(null)}
        consultation={selectedConsult}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Consultation Records
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => addToast("Filters active: My Consultations")}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={() => addToast("Downloading CSV Report...")}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="bg-[#0A0F1E]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5">
        {consultations.length === 0 ? (
          <p className="text-slate-400 text-center">
            No consultations found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm uppercase">
                  <th className="pb-4 pl-4">Reference</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Started</th>
                  <th className="pb-4 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {consultations.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 pl-4 text-white font-medium text-sm">
                      {c.consultation_ref}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          c.status === "flagged"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-4 text-slate-400 text-sm">
                      {c.started_at
                        ? new Date(c.started_at).toLocaleString()
                        : "-"}
                    </td>

                    <td className="py-4 text-right pr-4">
                      <button
                        onClick={() => setSelectedConsult(c)}
                        className="text-cyan-400 hover:text-cyan-300 text-xs font-bold"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationRecordsView;
