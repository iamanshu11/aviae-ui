const AddPatientModal = ({ isOpen, onClose, onAdd, addToast }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', dob: '', nhs: '', gender: 'Male' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
       addToast("Please fill in required fields", "error");
       return;
    }
    onAdd({ ...formData, id: Date.now(), condition: "New Registration", lastVisit: "Just now" });
    setFormData({ firstName: '', lastName: '', dob: '', nhs: '', gender: 'Male' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#131B2C] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Register New Patient</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
               <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none" 
                  placeholder="Jane"
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
               <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none" 
                  placeholder="Doe"
               />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
               <input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none" 
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">NHS Number</label>
               <input 
                  type="text" 
                  value={formData.nhs}
                  onChange={(e) => setFormData({...formData, nhs: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none" 
                  placeholder="000-000-000"
               />
            </div>
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
             <div className="flex gap-4">
               {['Male', 'Female', 'Other'].map(g => (
                 <button 
                    key={g} 
                    type="button"
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${formData.gender === g ? 'bg-fuchsia-600 border-fuchsia-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                 >
                   {g}
                 </button>
               ))}
             </div>
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-purple-500/20 transition-all mt-4">
            Register Patient
          </button>
        </form>
      </div>
    </div>
  );
};