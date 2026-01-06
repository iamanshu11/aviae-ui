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
import { listConsultationRecordsAPI } from "../api-helpers/consultation-record";

const LIVE_PROTOCOL = "Sore Throat";

const DashboardView = ({
  setActiveTab,
  addToast,
  launchConsultation,
  isLoadingConsultation
}) => {
  const [activeConsults, setActiveConsults] = useState(3);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  /* ---------------- Active consult counter animation ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConsults(prev => (prev === 3 ? 4 : 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- Fetch recent consultations ---------------- */
  useEffect(() => {
    const fetchRecentConsultations = async () => {
      try {
        setLoadingRecent(true);

        const consultations = await listConsultationRecordsAPI();

        const recent = consultations
          .sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
          .slice(0, 5);

        setRecentConsultations(recent);
      } catch (err) {
        console.error("Failed to load recent consultations", err);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentConsultations();
  }, []);


  const ClinicalCard = ({ title, subtitle, icon: Icon, color }) => {
    const isLive = title === LIVE_PROTOCOL;

    const ICON_MAP = {
      'Sore Throat': '/img/sore.png',
      'Uncomplicated UTI (Women)': '/img/women.png',
      'Acute Otitis Media (Ear Infection)': '/img/ear.png',
      'Acute Sinusitis': '/img/acute.png',
      'Impetigo': '/img/impetigo.png',
      'Infected Insect Bites': '/img/bites.png',
      'Shingles': '/img/shingles.png',
    };

    const imgSrc = ICON_MAP[title] || '/img/img.png';

    return (
      <div
        className={`relative overflow-hidden rounded-3xl p-[1px] transition-all duration-500 flex flex-col h-full
          ${isLive
            ? 'bg-gradient-to-br from-fuchsia-500 to-purple-500 shadow-lg hover:shadow-2xl hover:scale-[1.01]'
            : 'bg-slate-800/40 border border-slate-700/50 opacity-70'
          }`}
      >
        <div className="relative h-full w-full rounded-[23px] p-6 flex flex-col justify-between overflow-hidden bg-[#0F0A1F] bg-opacity-95 backdrop-blur-xl">

          {/* Header */}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3.5 rounded-2xl shadow-xl border border-white/10 bg-slate-800 text-white">
                <Icon size={32} />
              </div>

              {/* Status Badge */}
              <div
                className={`px-4 py-2 rounded-full border text-xs font-bold tracking-wider flex items-center gap-2
                  ${isLive
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-slate-800/60 border-slate-600 text-slate-400"
                  }`}
              >
                {isLive ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE PROTOCOL
                  </>
                ) : (
                  <>
                    <Clock size={12} />
                    COMING SOON
                  </>
                )}
              </div>
            </div>

            <h3 className="font-bold mb-3 tracking-tight text-2xl text-white">
              {title}
            </h3>
            <div className="mb-8 max-w-sm text-slate-400 text-sm">
              {subtitle}
            </div>
          </div>

          {/* Background Image */}
          <div className="relative z-10 mt-auto">
            <img
              src={imgSrc}
              alt={title}
              className="absolute bottom-0 right-0 w-32 h-32 opacity-10 select-none pointer-events-none"
            />
          </div>

          {/* CTA */}
          <div className="relative z-10 mt-auto">
            <button
              onClick={() => {
                if (!isLive) {
                  addToast?.("This protocol is coming soon 🚧", "info");
                  return;
                }
                launchConsultation(title);
              }}
              disabled={!isLive || isLoadingConsultation}
              className={`w-full py-3.5 rounded-xl font-bold tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 border border-white/20
                ${isLive
                  ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:-translate-y-1"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
            >
              {isLive ? (
                <>
                  <Sparkles size={18} className={isLoadingConsultation ? "animate-spin" : "animate-pulse"} />
                  {isLoadingConsultation ? "Initializing..." : "Launch Consultation"}
                  {!isLoadingConsultation && (
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                  )}
                </>
              ) : (
                <>
                  <Clock size={18} />
                  Coming Soon
                </>
              )}
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
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={26} />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-white text-2xl font-bold tracking-tight">{count}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={18} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Clinical Pathways */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl text-white shadow-lg">
            <Stethoscope size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Clinical Pathways</h2>
            <p className="text-slate-400 text-sm font-medium">
              Select a protocol to begin AI-assisted assessment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <ClinicalCard
            title="Sore Throat"
            subtitle={
              <ul className="list-disc pl-5 space-y-1">
                <li>Assessment using Centor criteria</li>
                <li>Red flag screening</li>
                <li>Advice and safety-netting</li>
                <li>Antibiotic supply under PGD where eligible</li>
              </ul>
            }
            icon={Thermometer}
          />

          <ClinicalCard
            title="Uncomplicated UTI (Women)"
            subtitle={
              <ul className="list-disc pl-5 space-y-1">
                <li>Women aged 16–64 years</li>
                <li>Symptom-based assessment</li>
                <li>Red flag exclusion</li>
                <li>Antibiotic supply under PGD where eligible</li>
              </ul>
            }
            icon={Droplets}
          />

          <ClinicalCard
            title="Acute Otitis Media (Ear Infection)"
            subtitle={
              <ul className="list-disc pl-5 space-y-1">
                <li>Children and adults (age criteria apply)</li>
                <li>Pain and infection assessment</li>
                <li>Red flag screening</li>
                <li>Antibiotic supply under PGD where eligible</li>
              </ul>
            }
            icon={Ear}
          />

          <ClinicalCard
            title="Acute Sinusitis"
            subtitle={
              <ul className="list-disc pl-5 space-y-1">
                <li>Symptom duration and severity assessment</li>
                <li>Red flag screening</li>
                <li>Advice and safety-netting</li>
                <li>Antibiotic supply under PGD where eligible</li>
              </ul>
            }
            icon={Activity}
          />

          <ClinicalCard
            title="Impetigo"
            subtitle={
              <ul className="list-disc pl-5 space-y-1">
                <li>Visual and symptom assessment</li>
                <li>Red flag screening</li>
                <li>Topical or oral antibiotic supply under PGD where eligible</li>
              </ul>
            }
            icon={Syringe}
          />

          <ClinicalCard
            title="Infected Insect Bites"
            subtitle={
              <ul className="list-disc pl-5 space-y-1">
                <li>Local infection assessment</li>
                <li>Red flag screening</li>
                <li>Antibiotic supply under PGD where eligible</li>
              </ul>
            }
            icon={User}
          />

          <ClinicalCard
            title="Shingles"
            subtitle={
              <ul className="list-disc pl-5 space-y-1">
                <li>Adults aged 18 years and over</li>
                <li>Symptom recognition</li>
                <li>Red flag screening</li>
                <li>Antiviral supply under PGD where eligible</li>
              </ul>
            }
            icon={AlertCircle}
          />

        </div>


      </div>

      {/* Metrics + Activity */}
      {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-8"> */}
      {/* <div className="xl:col-span-1 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 pl-2">
            <Activity size={18} className="text-fuchsia-400" /> Daily Metrics
          </h3>

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
        </div> */}

      {/* -------- Recent Activity -------- */}
      <div className="xl:col-span-2 bg-[#0A0F1E]/60 rounded-[2.5rem] p-8 border border-white/5">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <p className="text-slate-400 text-sm">Latest consultations</p>
          </div>
          <button
            onClick={() => setActiveTab('records')}
            className="px-4 py-2 rounded-lg bg-slate-800/50 text-fuchsia-400 text-xs font-bold"
          >
            View Full History
          </button>
        </div>

        {loadingRecent ? (
          <p className="text-slate-400">Loading recent activity...</p>
        ) : recentConsultations.length === 0 ? (
          <p className="text-slate-400 text-center">No recent consultations</p>
        ) : (
          <div className="space-y-4">
            {recentConsultations.map(c => (
              <div
                key={c.id}
                onClick={() => setActiveTab('records')}
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-800/20 border border-white/5 hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                    {(c.patient_initials || "PT")}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">
                      {c.consultation_ref}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {c.condition_slug?.replace(/-/g, ' ') || "Consultation"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={10} />
                  {c.started_at ? new Date(c.started_at).toLocaleTimeString() : "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default DashboardView;