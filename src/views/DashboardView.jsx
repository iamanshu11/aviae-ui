import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  Stethoscope,
  Thermometer,
  Syringe,
  Ear,
  Droplets,
  User,
  FileText,
  AlertCircle,
  Activity,
  Clock
} from 'lucide-react';
import { RECENT_ACTIVITY } from '../data/patients';

const DashboardView = ({ setActiveTab, addToast, launchConsultation, isLoadingConsultation }) => {
  const [activeConsults, setActiveConsults] = useState(3);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConsults(prev => prev === 3 ? 4 : 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const ClinicalCard = ({ title, subtitle, icon: Icon, status, color }) => {
    const isActive = status === 'Active';
    const isFuchsia = color === 'fuchsia';
    const isCyan = color === 'cyan';
    
    // map known protocol titles to image assets in public/img
    const ICON_MAP = {
      'Sore Throat Service': '/img/sore.png',
      'Seasonal Flu': '/img/cold.png',
      'Headache & Migraine': '/img/img.png',
      'Stomach Pain': '/img/stomach.png',
      'Body Pain': '/img/body.png',
    };

    const imgSrc = ICON_MAP[title] || '/img/img.png';

    return (
      <div className={`relative overflow-hidden rounded-3xl p-[1px] transition-all duration-500 group flex flex-col h-full ${
        isActive 
          ? `bg-gradient-to-br ${isFuchsia ? 'from-fuchsia-500 to-purple-500' : isCyan ? 'from-cyan-500 to-blue-500' : 'from-violet-500 to-indigo-500'} shadow-lg hover:shadow-2xl hover:scale-[1.01]` 
          : 'bg-slate-800/40 border border-slate-700/50'
      }`}>
        <div className={`relative h-full w-full rounded-[23px] p-6 flex flex-col justify-between overflow-hidden bg-[#0F0A1F] bg-opacity-95 backdrop-blur-xl`}>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3.5 rounded-2xl shadow-xl border border-white/10 bg-slate-800 text-white`}>
                <Icon size={32} />
              </div>
              <div className={`px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-wider flex items-center gap-2`}>
                 <span className={`relative flex h-2 w-2`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-green-500`}></span>
                  </span>
                 LIVE PROTOCOL
              </div>
            </div>
            <h3 className="font-bold mb-3 tracking-tight text-2xl text-white">{title}</h3>
            <p className="text-sm leading-relaxed mb-8 max-w-sm text-slate-400">{subtitle}</p>
          </div>
          <div className='relative z-10 mt-auto'>
            <img src={imgSrc} alt={title} className='absolute bottom-0 right-0 w-32 h-32 opacity-10 select-none pointer-events-none' />
          </div>
          <div className="relative z-10 mt-auto">
             <button 
                onClick={() => launchConsultation(title)}
                disabled={isLoadingConsultation}
                className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${isFuchsia ? 'from-fuchsia-600 to-purple-600' : 'from-cyan-600 to-blue-600'} text-white font-bold tracking-wide shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
              >
                <Sparkles size={18} className={isLoadingConsultation ? "animate-spin" : "animate-pulse"} />
                {isLoadingConsultation ? "Initializing..." : "Launch Consultation"}
                {!isLoadingConsultation && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
          </div>
        </div>
      </div>
    );
  };

  const ResourceCard = ({ title, count, icon: Icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className="relative overflow-hidden bg-[#131B2C]/60 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex items-center gap-5 hover:bg-[#131B2C]/80 transition-all hover:border-white/10 group cursor-pointer"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
        <Icon size={26} />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-white text-2xl font-bold tracking-tight">{count}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
        <ChevronRight size={18} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl text-white shadow-lg shadow-purple-900/20">
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Clinical Pathways</h2>
                <p className="text-slate-400 text-sm font-medium">Select a protocol to begin AI-assisted assessment</p>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ClinicalCard title="Sore Throat Service" subtitle="Pharmacy First protocol for acute sore throat." icon={Thermometer} status="Active" color="fuchsia" />
          <ClinicalCard title="Seasonal Flu" subtitle="Assessment for antiviral eligibility and vaccination status." icon={Syringe} status="Active" color="cyan" />
          <ClinicalCard title="Headache & Migraine" subtitle="Pediatric and adult assessment for headache and migraine." icon={Ear} status="Active" color="violet" />
          <ClinicalCard title="Stomach Pain" subtitle="Assessment for abdominal pain and discomfort." icon={Droplets} status="Active" color="rose" />
          <ClinicalCard title="Body Pain" subtitle="Assessment for generalized body pain." icon={User} status="Active" color="amber" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-8">
          <div className="xl:col-span-1 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pl-2"><Activity size={18} className="text-fuchsia-400"/> Daily Metrics</h3>
            <ResourceCard 
              title="Active Consults" 
              count={activeConsults} 
              icon={FileText} 
              color="from-emerald-400 to-green-600" 
              onClick={() => setActiveTab('records')}
            />
            <ResourceCard 
              title="Pending Review" 
              count="1" 
              icon={AlertCircle} 
              color="from-amber-400 to-orange-600" 
              onClick={() => setActiveTab('records')}
            />
            <ResourceCard 
              title="Total Patients" 
              count="142" 
              icon={User} 
              color="from-violet-400 to-purple-600" 
              onClick={() => setActiveTab('patients')}
            />
          </div>

          <div className="xl:col-span-2 bg-[#0A0F1E]/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                <p className="text-slate-400 text-sm">Real-time consultation log</p>
              </div>
              <button onClick={() => setActiveTab('records')} className="px-4 py-2 rounded-lg bg-slate-800/50 text-fuchsia-400 text-xs font-bold uppercase tracking-wider hover:bg-fuchsia-500/10 transition-colors">View Full History</button>
            </div>
            <div className="space-y-4">
                {RECENT_ACTIVITY.slice(0, 3).map((patient, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-800/20 border border-white/5 hover:border-white/10 group cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-sm font-bold border border-white/5 shadow-inner">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-base">{patient.name} <span className="text-slate-500 font-medium ml-2 text-sm">{patient.id}</span></h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                              <p className="text-xs text-slate-400 font-medium">{patient.condition}</p>
                            </div>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col items-end">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mb-1.5 shadow-sm ${
                            patient.outcome.includes("Antibiotics") ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                            patient.outcome.includes("GP") ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                            {patient.outcome}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock size={10} /> {patient.time}
                        </p>
                      </div>
                  </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardView;