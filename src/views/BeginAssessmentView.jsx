import React, { useState, useEffect } from "react";
import { ClipboardList, ArrowLeft, CheckCircle } from "lucide-react";
import { getMetadata, callInit } from "../api-helpers/consultation";

const QUESTIONS = [
  {
    id: "age",
    title: "Enter Patient Age",
    subtitle: "Please enter the patient’s age in completed years",
    type: "number",
  },
  {
    id: "gender",
    title: "Select Gender",
    subtitle: "Used for clinical relevance",
    options: ["Male", "Female", "Other", "Prefer not to say"],
  },
  {
    id: "concern",
    title: "Primary Health Concern",
    subtitle: "Choose the closest match",
    options: [
      "General Health",
      "Fever / Flu",
      "Pain or Injury",
      "Skin Issues",
      "Mental Health",
      "Other",
    ],
  },
];

const BeginAssessmentView = ({ protocol, onComplete, addToast }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const current = QUESTIONS[step];

  const getConditionSlug = (protocolName) => {
    const protocolMap = {
      "Sore Throat Service": "sore-throat",
      "Seasonal Flu": "seasonal-flu",
      "Headache & Migraine": "headache-migraine",
      "Stomach Pain": "stomach-pain",
      "Body Pain": "body-pain",
    };
    return (
      protocolMap[protocolName] ||
      protocolName.toLowerCase().replace(/\s+/g, "-")
    );
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      const slug = getConditionSlug(protocol);
      const res = await getMetadata(slug);
      if (res.success) setMetadata(res.data);
      else addToast?.(res.error || "Failed to fetch metadata", "error");
    };
    fetchMetadata();
  }, [protocol]);

  const goNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleAgeSubmit = () => {
    const age = Number(answers.age);

    if (!age || age < 1 || age > 120) {
      addToast?.("Please enter a valid age between 1 and 120", "error");
      return;
    }

    goNext();
  };

  const handleSelect = async (value) => {
    if (isInitializing) return;

    const updatedAnswers = { ...answers, [current.id]: value };
    setAnswers(updatedAnswers);

    if (step < QUESTIONS.length - 1) {
      setTimeout(goNext, 200);
      return;
    }

    // Final step — init consultation
    try {
      setIsInitializing(true);

      const age = Number(updatedAnswers.age);
      const sex = updatedAnswers.gender;
      const consent = true;

      if (!age || !sex || typeof consent !== "boolean") {
        throw new Error("All required fields must be filled");
      }

      let initials = "XX";
      try {
        const u = JSON.parse(localStorage.getItem("user"));
        if (u?.name) {
          initials = u.name
            .split(/\s+/)
            .map((n) => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();
        }
      } catch (e) {}

      const payload = {
        condition_slug: getConditionSlug(protocol),
        patient_initials: initials,
        patient_age: age, // ✅ exact numeric age
        patient_sex: sex,
        consent_given: consent,
      };

      const result = await callInit(payload);

      if (!result?.success) {
        addToast?.(result?.error || "Unable to start consultation", "error");
        return;
      }

      addToast?.("Consultation started successfully", "success");
      onComplete?.(updatedAnswers, result.data);
    } catch (error) {
      addToast?.(error.message || "Failed to start consultation", "error");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-[#0A0F1E]/90 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-white/10 bg-[#0F1623]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Consultation Assessment
              </h2>
              <p className="text-xs text-slate-400">
                Step {step + 1} of {QUESTIONS.length}
              </p>
            </div>
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}
        </div>

        <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
            style={{
              width: `${((step + 1) / QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-10 overflow-auto custom-scrollbar">
        <h3 className="text-2xl font-bold text-white mb-2">
          {current.title}
        </h3>
        <p className="text-sm text-slate-400 mb-8">
          {current.subtitle}
        </p>

        {/* AGE INPUT */}
        {current.type === "number" && (
          <div className="max-w-sm space-y-6">
            <input
              type="number"
              min={1}
              max={120}
              value={answers.age || ""}
              onChange={(e) =>
                setAnswers({ ...answers, age: e.target.value })
              }
              placeholder="Enter age in years"
              className="w-full px-5 py-4 rounded-2xl bg-slate-900/70 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
            />

            <button
              onClick={handleAgeSubmit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold"
            >
              Continue
            </button>
          </div>
        )}

        {/* OPTION BUTTONS */}
        {current.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {current.options.map((opt) => {
              const selected = answers[current.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={isInitializing}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${
                    selected
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent"
                      : "bg-slate-900/70 border-slate-700 text-slate-200 hover:border-cyan-500/50"
                  }`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                  {selected && <CheckCircle size={18} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BeginAssessmentView;
