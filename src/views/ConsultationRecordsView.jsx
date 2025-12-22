import React, { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import ConsultationModal from '../components/modals/ConsultationModal';
import { RECENT_ACTIVITY } from '../data/patients';

const ConsultationRecordsView = ({ addToast }) => {
  const [selectedConsult, setSelectedConsult] = useState(null);
  
  const mockConsults = RECENT_ACTIVITY;

  return (
    <div className="space-y-6">
      <ConsultationModal isOpen={!!selectedConsult} onClose={() => setSelectedConsult(null)} consultation={selectedConsult} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Consultation Records</h2>
        <div className="flex gap-2">
           <button onClick={() => addToast("Filters active: All")} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"><Filter size={20}/></button>
           <button onClick={() => addToast("Downloading CSV Report...")} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"><Download size={20}/></button>
        </div>
      </div>

      <div className="bg-[#0A0F1E]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider">
                <th className="pb-4 pl-4">Patient</th>
                <th className="pb-4">Condition</th>
                <th className="pb-4">Date & Time</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Outcome</th>
                <th className="pb-4 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockConsults.map((consult, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {consult.name.charAt(0)}
                      </div>
                      <div>
                         <p className="text-white font-medium text-sm">{consult.name}</p>
                         <p className="text-xs text-slate-500">ID: {consult.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-300 text-sm">{consult.condition}</td>
                  <td className="py-4 text-slate-400 text-sm">{consult.time}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${consult.status === 'Flagged' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {consult.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-300 text-sm">{consult.outcome}</td>
                  <td className="py-4 text-right pr-4">
                     <button onClick={() => setSelectedConsult(consult)} className="text-cyan-400 hover:text-cyan-300 text-xs font-bold">VIEW</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRecordsView;