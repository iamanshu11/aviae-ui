import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, AlertTriangle } from "lucide-react";

const ConsultationChatView = ({
  protocol,
  metadata,
  consultationData,
  onEnd,
  addToast,
}) => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hello. I am initialized for the ${protocol} protocol.`,
    },
  ]);

  const [input, setInput] = useState("");

  /* ---------------- Symptoms ---------------- */
  const [durationBand, setDurationBand] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientNotes, setPatientNotes] = useState("");

  /* ---------------- Red Flags ---------------- */
  const [showRedFlags, setShowRedFlags] = useState(false);
  const [redFlags, setRedFlags] = useState({});
  const [redFlagsSubmitted, setRedFlagsSubmitted] = useState(false);

  /* ---------------- Post Steps ---------------- */
  const [showPostActions, setShowPostActions] = useState(false);
  const [outcomeLoaded, setOutcomeLoaded] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages, showRedFlags, showPostActions]
  );

  /* ---------------- Helpers ---------------- */
  const toggleSymptom = (label) => {
    setSelectedSymptoms((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label]
    );
  };

  const setRedFlagAnswer = (code, value) => {
    setRedFlags((prev) => ({ ...prev, [code]: value }));
  };

  /* ---------------- Submit Symptoms ---------------- */
  const submitSymptoms = async () => {
    if (!durationBand) {
      addToast?.("Please select duration", "error");
      return;
    }

    try {
      const { updateSymptoms } = await import("../api-helpers/consultation");

      const payload = {
        duration_band: durationBand,
        symptoms_list: selectedSymptoms,
        patient_notes: patientNotes,
      };

      await updateSymptoms(consultationData.consultation_id, payload);

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: `Symptoms submitted (${selectedSymptoms.join(", ")})`,
        },
        {
          role: "ai",
          text: "Thank you. Now assessing red flags.",
        },
      ]);

      const initialRF = {};
      metadata.red_flags.forEach((r) => (initialRF[r.code] = null));
      setRedFlags(initialRF);

      setShowRedFlags(true);
    } catch (e) {
      addToast?.(e.message, "error");
    }
  };

  /* ---------------- Submit Red Flags ---------------- */
  const submitRedFlags = async () => {
    try {
      const {
        updateRedFlags,
        updateExam,
        updateHistory,
      } = await import("../api-helpers/consultation");

      await updateRedFlags(consultationData.consultation_id, {
        answers: redFlags,
        override: { active: false, justification: null },
      });

      await updateExam(consultationData.consultation_id, {
        fever_history: "No",
        tender_lymph_nodes: "Yes",
        tonsillar_exudate: "Yes",
        cough_status: "NoCough",
      });

      await updateHistory(consultationData.consultation_id, {
        current_meds: "None",
        conditions: "None",
        allergies_present: false,
        allergy_details: null,
        recent_antibiotics: "No",
        recent_assessment: "No",
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Red flags reviewed. Assessment completed." },
      ]);

      setShowRedFlags(false);
      setRedFlagsSubmitted(true);
      setShowPostActions(true);
    } catch (e) {
      addToast?.(e.message, "error");
    }
  };

  /* ---------------- Outcome ---------------- */
  const handleGetOutcome = async () => {
    try {
      const { getOutcome } = await import("../api-helpers/consultation");
      const res = await getOutcome(consultationData.consultation_id);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `Outcome: ${res.data?.disposition}` },
      ]);

      setOutcomeLoaded(true);
    } catch (e) {
      addToast?.(e.message, "error");
    }
  };

  /* ---------------- Finalize ---------------- */
  const handleFinalize = async () => {
    try {
      const { finalizeConsultation } = await import(
        "../api-helpers/consultation"
      );
      await finalizeConsultation(consultationData.consultation_id);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Consultation finalized successfully." },
      ]);

      setFinalized(true);
    } catch (e) {
      addToast?.(e.message, "error");
    }
  };

  /* ---------------- SOAP ---------------- */
  const handleSoap = async () => {
    try {
      const { getSoapNote } = await import("../api-helpers/consultation");
      const res = await getSoapNote(consultationData.consultation_id);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `SOAP: ${res.data?.summary}` },
      ]);
    } catch (e) {
      addToast?.(e.message, "error");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-[#0A0F1E] rounded-2xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-xl max-w-[80%] text-sm ${
                m.role === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* ================= YOUR EXACT UI BELOW ================= */}

        {/* Symptoms UI */}
        {!showRedFlags && !redFlagsSubmitted && metadata && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
            <h4 className="text-sm font-semibold text-white mb-3">
              Clinical Questions
            </h4>

            {/* Duration */}
            <div className="mb-4">
              <p className="text-xs text-slate-300 mb-2">Duration</p>
              <div className="flex flex-wrap gap-2">
                {metadata.enums?.duration_band?.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDurationBand(d)}
                    className={`px-3 py-2 rounded ${
                      durationBand === d
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {metadata.symptoms_list?.map((s) => (
                <label
                  key={s.label}
                  className={`flex gap-2 p-2 rounded cursor-pointer ${
                    selectedSymptoms.includes(s.label)
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                  onClick={() => toggleSymptom(s.label)}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(s.label)}
                    readOnly
                  />
                  {s.label}
                </label>
              ))}
            </div>

            <textarea
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              className="w-full p-3 rounded bg-slate-900 text-slate-200 mb-4"
              placeholder="Patient notes"
            />

            <button
              onClick={submitSymptoms}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit symptoms
            </button>
          </div>
        )}

        {/* Red Flags UI */}
        {showRedFlags && (
          <div className="p-6 bg-rose-950/30 rounded-2xl border border-rose-500/30">
            <h4 className="flex items-center gap-2 text-rose-300 mb-4">
              <AlertTriangle size={18} /> Red Flag Assessment
            </h4>

            {metadata.red_flags.map((rf) => (
              <div
                key={rf.code}
                className="flex justify-between items-center mb-3"
              >
                <p className="text-sm text-slate-200 max-w-[70%]">
                  {rf.question}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRedFlagAnswer(rf.code, true)}
                    className={`px-3 py-1 rounded ${
                      redFlags[rf.code] === true
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setRedFlagAnswer(rf.code, false)}
                    className={`px-3 py-1 rounded ${
                      redFlags[rf.code] === false
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={submitRedFlags}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded"
            >
              Confirm red flags
            </button>
          </div>
        )}

        {/* Post Actions */}
        {showPostActions && (
          <div className="p-6 bg-slate-900 gap-3 rounded-2xl space-y-3">
            <button
              onClick={handleGetOutcome}
              disabled={outcomeLoaded}
              className="px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50"
            >
              Get Outcome
            </button>
            <button
              onClick={handleFinalize}
              disabled={!outcomeLoaded || finalized}
              className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50"
            >
              Finalize Consultation
            </button>
            <button
              onClick={handleSoap}
              disabled={!finalized}
              className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
            >
              View SOAP Note
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConsultationChatView;
