import React, { useState } from 'react';
import { ArrowLeft, Phone, Calendar, MapPin } from 'lucide-react';

const PatientDetailView = ({ patient, onBack, addToast }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [data, setData] = useState(patient);

   const handleSave = () => {
      setIsEditing(false);
      addToast("Patient details saved", "success");
   };

   return (
     <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-300">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
           <ArrowLeft size={18} /> Back to Directory
        </button>

        <div className="bg-[#0A0F1E]/90 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5">
           <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shrink-0">
                 {data.firstName.charAt(0)}{data.lastName.charAt(0)}
              </div>
              
              <div className="flex-1 w-full">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h2 className="text-3xl font-bold text-white">{data.firstName} {data.lastName}</h2>
                       <p className="text-slate-400 mt-1">NHS Number: {data.nhs}</p>
                    </div>
                    <button 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isEditing ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                    >
                       {isEditing ? 'Save Changes' : 'Edit Details'}
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                       {isEditing ? (
                          <input type="text" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600" />
                       ) : (
                          <p className="text-white flex items-center gap-2"><Phone size={14} className="text-slate-500"/> {data.phone}</p>
                       )}
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                       <p className="text-white flex items-center gap-2"><Calendar size={14} className="text-slate-500"/> {data.dob}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                       {isEditing ? (
                          <input type="text" value={data.address} onChange={e => setData({...data, address: e.target.value})} className="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600" />
                       ) : (
                          <p className="text-white flex items-center gap-2"><MapPin size={14} className="text-slate-500"/> {data.address}</p>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Recent History for Patient */}
        <h3 className="text-xl font-bold text-white mt-8 pl-2">Recent Clinical History</h3>
        <div className="bg-[#0A0F1E]/60 rounded-[2rem] p-6 border border-white/5 space-y-4">
           {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-white/5 flex justify-between items-center">
                 <div>
                    <p className="text-white font-bold text-sm">Sore Throat Consultation</p>
                    <p className="text-xs text-slate-500">Oct {20 + i}, 2024 • Dr. Asif S.</p>
                 </div>
                 <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">Completed</span>
              </div>
           ))}
        </div>
     </div>
   );
};

export default PatientDetailView;