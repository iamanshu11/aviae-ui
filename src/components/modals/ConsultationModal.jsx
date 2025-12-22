import { X } from 'lucide-react';

const ConsultationModal = ({ isOpen, onClose, consultation }) => {
  if (!isOpen || !consultation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#131B2C] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl p-8 m-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
         <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  {consultation.status}
                </div>
                <span className="text-slate-500 text-sm">{consultation.time}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{consultation.condition} Consultation</h2>
              <p className="text-slate-400">Patient: {consultation.name} ({consultation.id})</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white"><X size={20} /></button>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
               <h4 className="text-sm font-bold text-white mb-2">Outcome</h4>
               <p className="text-slate-300">{consultation.outcome}</p>
            </div>
            
            <div className="space-y-2">
               <h4 className="text-sm font-bold text-slate-500 uppercase">Clinical Notes (SOAP)</h4>
               <div className="space-y-3 text-sm text-slate-300">
                  <p><span className="text-fuchsia-400 font-bold">S:</span> Patient presented with 2-day history of sore throat. No fever. Eating well.</p>
                  <p><span className="text-fuchsia-400 font-bold">O:</span> Tonsils visibly red, no exudate. Lymph nodes normal. Temp 37.1C.</p>
                  <p><span className="text-fuchsia-400 font-bold">A:</span> Centor Score 1. Viral pharyngitis likely.</p>
                  <p><span className="text-fuchsia-400 font-bold">P:</span> Self-care advice given (fluids, paracetamol). Safety netted for worsening symptoms.</p>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
               <button className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-bold text-sm hover:bg-white/10">Print Summary</button>
               <button onClick={onClose} className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-500">Close Record</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConsultationModal;