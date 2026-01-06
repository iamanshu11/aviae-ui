import React, { useEffect, useState } from "react";
import { Filter, Download, FileText, ChevronRight } from "lucide-react";
import ConsultationModal from "../components/modals/ConsultationModal";
import { listConsultationRecordsAPI } from "../api-helpers/consultation-record";

const ConsultationRecordsView = ({ addToast }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsult, setSelectedConsult] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const data = await listConsultationRecordsAPI();
        setConsultations(data || []);
      } catch (err) {
        console.error("Failed to load consultations", err);
        addToast?.(
          err.message || "Failed to load consultation records",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="bg-[#0A0F1E]/80 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-white/5">
        <p className="text-slate-400 animate-pulse text-sm sm:text-base">
          Loading consultation records…
        </p>
      </div>
    );
  }

  /* --------- STATUS BADGE COMPONENT --------- */
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      flagged: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      default: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    const badgeStyle = statusConfig[status] || statusConfig.default;

    return (
      <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold border capitalize inline-block ${badgeStyle}`}>
        {status || "in-progress"}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Modal */}
      <ConsultationModal
        isOpen={!!selectedConsult}
        onClose={() => setSelectedConsult(null)}
        consultation={selectedConsult}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Consultation Records
          </h2>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => addToast?.("Filters active: My Consultations")}
            className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Filter consultations"
          >
            <Filter size={18} />
          </button>

          <button
            onClick={() => addToast?.("Downloading CSV report…")}
            className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Download report"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-white/5 w-full min-w-0 overflow-hidden">
        {consultations.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="text-slate-400" size={24} />
            </div>
            <p className="text-slate-300 font-semibold text-sm sm:text-base">
              No consultations found
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Consultations you complete will appear here
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#0A0F1E] z-10">
                  <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="pb-4 pl-4 font-semibold">Reference</th>
                    <th className="pb-4 font-semibold">Status</th>
                    <th className="pb-4 font-semibold">Started</th>
                    <th className="pb-4 text-right pr-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {consultations.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 pl-4 text-white font-medium whitespace-nowrap">
                        {c.consultation_ref}
                      </td>

                      <td className="py-4 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>

                      <td className="py-4 text-slate-400 whitespace-nowrap">
                        {c.started_at
                          ? new Date(c.started_at).toLocaleString()
                          : "-"}
                      </td>

                      <td className="py-4 text-right pr-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedConsult(c)}
                          className="text-cyan-400 hover:text-cyan-300 text-xs font-bold tracking-wide transition-colors"
                        >
                          VIEW
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {consultations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConsult(c)}
                  className="w-full bg-white/[0.02] hover:bg-white/5 border border-white/10 rounded-xl p-4 transition-all text-left group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 truncate mb-1">
                        {c.consultation_ref}
                      </p>
                      <p className="text-white font-semibold text-sm break-words">
                        Reference #{c.consultation_ref?.split("-")[0] || "—"}
                      </p>
                    </div>
                    <ChevronRight className="text-slate-400 group-hover:text-cyan-400 flex-shrink-0 mt-0.5 transition-colors" size={18} />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={c.status} />
                    <p className="text-xs text-slate-500 flex-shrink-0">
                      {c.started_at
                        ? new Date(c.started_at).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsultationRecordsView;