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

  /* ---------------- Progress ---------------- */
  // 0: Symptoms, 1: Red Flags, 2: History, 3: Outcome
  const [progressStep, setProgressStep] = useState(0);
  const [loadingSoap, setLoadingSoap] = useState(false);


  // Step state: 0 = Symptoms, 1 = Red Flags, 2 = History, 3 = Outcome/Finalize
  const [durationBand, setDurationBand] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientNotes, setPatientNotes] = useState("");
  const [redFlags, setRedFlags] = useState({});
  const [historyAnswers, setHistoryAnswers] = useState({
    current_meds: "",
    conditions: "",
    allergies_present: "",
    allergy_details: "",
    recent_antibiotics: "",
    recent_assessment: "",
  });
  const [outcome, setOutcome] = useState(null);
  const [soapNote, setSoapNote] = useState(null);
  const [finalized, setFinalized] = useState(false);
  const [showPostActions, setShowPostActions] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);


  const messagesEndRef = useRef(null);
  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  /* ---------------- Helpers ---------------- */
  const toggleSymptom = (label) => {
    setSelectedSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const setRedFlagAnswer = (code, value) => {
    setRedFlags((prev) => ({ ...prev, [code]: value }));
  };

  const isRedFlagsComplete =
    Object.keys(redFlags).length > 0 &&
    Object.values(redFlags).every((v) => typeof v === "boolean");

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
          text: "Thank you. Now assessing safety questions.",
        },
      ]);
      const initialRF = {};
      metadata.red_flags.forEach((r) => (initialRF[r.code] = null));
      setRedFlags(initialRF);
      setProgressStep(1);
    } catch (e) {
      addToast?.(e.message, "error");
    }
  };

  /* ---------------- Submit Red Flags ---------------- */
  const submitRedFlags = async () => {
    try {
      const { updateRedFlags, updateExam } = await import(
        "../api-helpers/consultation"
      );
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
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Thank you. Now a few questions about your medical history.",
        },
      ]);
      setProgressStep(2);
    } catch (e) {
      addToast?.(e.message, "error");
    }
  };

  /* ---------------- Submit History ---------------- */
  const submitHistory = async () => {
    try {
      setProgressStep(3);
      setLoadingSoap(true); // 👈 START LOADER

      const {
        updateHistory,
        getOutcome,
        finalizeConsultation,
        getSoapNote,
      } = await import("../api-helpers/consultation");

      await updateHistory(consultationData.consultation_id, {
        current_meds: historyAnswers.current_meds,
        conditions: historyAnswers.conditions,
        allergies_present: historyAnswers.allergies_present === "yes",
        allergy_details:
          historyAnswers.allergies_present === "yes"
            ? historyAnswers.allergy_details
            : null,
        recent_antibiotics: historyAnswers.recent_antibiotics,
        recent_assessment: historyAnswers.recent_assessment,
      });

      // Outcome
      const outcomeRes = await getOutcome(consultationData.consultation_id);
      setOutcome(outcomeRes.data);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Analyzing your responses and generating clinical summary…",
        },
      ]);

      // Finalize
      await finalizeConsultation(consultationData.consultation_id);
      setFinalized(true);

      // SOAP
      const soapRes = await getSoapNote(consultationData.consultation_id);
      const soapObj = soapRes.data?.soap || soapRes.data?.summary || null;
      setSoapNote(soapObj);

      setShowPostActions(true);
    } catch (e) {
      addToast?.(e.message, "error");
    } finally {
      setLoadingSoap(false); // 👈 STOP LOADER
    }
  };


  /* ---------------- Download PDF ---------------- */
  const handleDownloadPDF = async () => {
    setPdfDownloading(true);
    try {
      const { generatePDF, downloadPDF } = await import(
        "../api-helpers/consultation"
      );

      // Step 1: Generate PDF (if not already generated)
      const generateResult = await generatePDF(
        consultationData.consultation_id
      );

      // If generation failed due to SOAP note not found, show error
      if (!generateResult.success) {
        if (generateResult.error?.includes("SOAP note not found")) {
          addToast?.(
            "SOAP note not found. Please generate SOAP note first.",
            "error"
          );
          return;
        }
        // For other errors (like PDF already exists), continue to download
      }

      // Step 2: Download PDF
      const downloadResult = await downloadPDF(
        consultationData.consultation_id
      );

      if (downloadResult.success) {
        addToast?.("PDF downloaded successfully!", "success");
      } else {
        addToast?.(
          downloadResult.error || "Failed to download PDF",
          "error"
        );
      }
    } catch (e) {
      addToast?.(e.message || "Failed to download PDF", "error");
    } finally {
      setPdfDownloading(false);
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
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`p-4 rounded-xl max-w-[80%] text-sm ${m.role === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-slate-200"
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Progress Bar - always visible */}
        <div className="w-full mb-4 sticky top-0 z-10 bg-[#0A0F1E]">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`flex-1 h-2 rounded ${progressStep >= 0 ? "bg-cyan-500" : "bg-slate-700"
                }`}
            ></div>
            <div
              className={`flex-1 h-2 rounded ${progressStep >= 1 ? "bg-rose-500" : "bg-slate-700"
                }`}
            ></div>
            <div
              className={`flex-1 h-2 rounded ${progressStep >= 2 ? "bg-amber-500" : "bg-slate-700"
                }`}
            ></div>
            <div
              className={`flex-1 h-2 rounded ${progressStep >= 3 ? "bg-emerald-500" : "bg-slate-700"
                }`}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Symptoms</span>
            <span>Safety</span>
            <span>History</span>
            <span>Outcome</span>
          </div>
        </div>

        {/* Symptoms UI - only show if on step 0 */}
        {progressStep === 0 && metadata && (
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
                    className={`px-3 py-2 rounded ${durationBand === d
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
                  className={`flex gap-2 p-2 rounded cursor-pointer ${selectedSymptoms.includes(s.label)
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
              placeholder="Patient Name"
            />

            <button
              onClick={submitSymptoms}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit symptoms
            </button>
          </div>
        )}

        {/* Red Flags UI - only show if on step 1 */}
        {progressStep === 1 && metadata && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
            <h4 className="flex items-center gap-2 text-red-500 mb-4">
              <AlertTriangle size={18} /> Please answer the following safety
              questions
            </h4>
            <p className="text-xs text-red-300 mb-4">
              These questions help us check for any urgent issues that may
              require special attention.
            </p>
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
                    className={`px-3 py-1 rounded ${redFlags[rf.code] === true
                        ? "bg-rose-600 text-white"
                        : "bg-slate-500"
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setRedFlagAnswer(rf.code, false)}
                    className={`px-3 py-1 rounded ${redFlags[rf.code] === false
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-500"
                      }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={submitRedFlags}
              disabled={!isRedFlagsComplete}
              className={`mt-4 px-4 py-2 rounded ${isRedFlagsComplete
                  ? "bg-rose-600 text-white"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
            >
              Continue
            </button>
            {!isRedFlagsComplete && (
              <p className="text-xs text-rose-200 mt-2">
                Please answer all safety questions to continue.
              </p>
            )}
          </div>
        )}

        {/* History Questions UI - only show if on step 2 */}
        {progressStep === 2 && metadata && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
            <h4 className="text-sm font-semibold text-white mb-3">
              Medical History
            </h4>
            <div className="mb-4">
              <label className="block text-xs text-slate-300 mb-1">
                Current medications
              </label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-800 text-slate-200"
                value={historyAnswers.current_meds}
                onChange={(e) =>
                  setHistoryAnswers((a) => ({
                    ...a,
                    current_meds: e.target.value,
                  }))
                }
                placeholder="e.g. None or list medications"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-slate-300 mb-1">
                Existing medical conditions
              </label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-800 text-slate-200"
                value={historyAnswers.conditions}
                onChange={(e) =>
                  setHistoryAnswers((a) => ({
                    ...a,
                    conditions: e.target.value,
                  }))
                }
                placeholder="e.g. None or list conditions"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-slate-300 mb-1">
                Do you have any allergies?
              </label>
              <div className="flex gap-3 mb-2">
                <button
                  className={`px-3 py-1 rounded ${historyAnswers.allergies_present === "yes"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-800 text-slate-200"
                    }`}
                  onClick={() =>
                    setHistoryAnswers((a) => ({
                      ...a,
                      allergies_present: "yes",
                    }))
                  }
                >
                  Yes
                </button>
                <button
                  className={`px-3 py-1 rounded ${historyAnswers.allergies_present === "no"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-200"
                    }`}
                  onClick={() =>
                    setHistoryAnswers((a) => ({
                      ...a,
                      allergies_present: "no",
                      allergy_details: "",
                    }))
                  }
                >
                  No
                </button>
              </div>
              {historyAnswers.allergies_present === "yes" && (
                <input
                  type="text"
                  className="w-full p-2 rounded bg-slate-800 text-slate-200 mt-2"
                  value={historyAnswers.allergy_details}
                  onChange={(e) =>
                    setHistoryAnswers((a) => ({
                      ...a,
                      allergy_details: e.target.value,
                    }))
                  }
                  placeholder="Please describe your allergies"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block text-xs text-slate-300 mb-1">
                Have you taken antibiotics recently?
              </label>
              <select
                className="w-full p-2 rounded bg-slate-800 text-slate-200"
                value={historyAnswers.recent_antibiotics}
                onChange={(e) =>
                  setHistoryAnswers((a) => ({
                    ...a,
                    recent_antibiotics: e.target.value,
                  }))
                }
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="NotSure">Not sure</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-slate-300 mb-1">
                Have you had a similar assessment recently?
              </label>
              <select
                className="w-full p-2 rounded bg-slate-800 text-slate-200"
                value={historyAnswers.recent_assessment}
                onChange={(e) =>
                  setHistoryAnswers((a) => ({
                    ...a,
                    recent_assessment: e.target.value,
                  }))
                }
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="NotSure">Not sure</option>
              </select>
            </div>
            <button
              onClick={submitHistory}
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={
                !historyAnswers.current_meds ||
                !historyAnswers.conditions ||
                !historyAnswers.allergies_present ||
                (historyAnswers.allergies_present === "yes" &&
                  !historyAnswers.allergy_details) ||
                !historyAnswers.recent_antibiotics ||
                !historyAnswers.recent_assessment
              }
            >
              Submit history
            </button>
          </div>
        )}

        {progressStep === 3 && loadingSoap && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-cyan-500/30 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="text-cyan-400" />
              <span className="text-cyan-400 font-semibold">
                Avaie is generating your consultation summary
              </span>
            </div>

            <div className="space-y-3">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              <div className="h-4 bg-slate-700 rounded w-2/3"></div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Please wait, this may take a few seconds…
            </p>
          </div>
        )}


        {/* Final SOAP and Download UI - only show if on step 3 and finalized */}
        {progressStep === 3 && finalized && showPostActions && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-emerald-500/30 mt-4">
            <h4 className="text-lg font-bold text-emerald-400 mb-2">
              Consultation Complete
            </h4>
            {outcome && (
              <div className="text-sm text-slate-300 mb-3">
                Outcome:{" "}
                <span className="font-semibold text-slate-100">
                  {outcome.title || outcome.decision_code}
                </span>
              </div>
            )}
            {outcome && outcome.drug_recommendation && (
              <div className="mb-2 text-slate-200">
                <span className="font-semibold">Recommended Medication:</span>{" "}
                {outcome.drug_recommendation.name}{" "}
                <span className="text-xs text-slate-400">
                  ({outcome.drug_recommendation.reason})
                </span>
              </div>
            )}
            {outcome &&
              (outcome.decision_code === "REFER_GP" ||
                outcome.decision_code === "REFER_URGENT") &&
              outcome.referral_details && (
                <div className="mb-2 text-amber-200">
                  <span className="font-semibold">Referral:</span>{" "}
                  {outcome.referral_details.reason}
                </div>
              )}
            <div className="mb-4">
              <div className="bg-slate-800 p-4 rounded-xl text-slate-100 text-base">
                {soapNote && typeof soapNote === "object" ? (
                  <div className="space-y-3">
                    {soapNote.S && (
                      <div>
                        <div className="text-sm text-slate-400">Subjective</div>
                        <div className="whitespace-pre-line mt-1">
                          {soapNote.S}
                        </div>
                      </div>
                    )}
                    {soapNote.O && (
                      <div>
                        <div className="text-sm text-slate-400">Objective</div>
                        <div className="mt-1 text-sm text-slate-200">
                          {Object.entries(soapNote.O).map(([k, v]) => (
                            <div key={k}>
                              <span className="font-semibold">
                                {k.replace(/_/g, " ")}:
                              </span>{" "}
                              {String(v)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {soapNote.A && (
                      <div>
                        <div className="text-sm text-slate-400">Assessment</div>
                        <div className="mt-1">{soapNote.A}</div>
                      </div>
                    )}
                    {soapNote.P && (
                      <div>
                        <div className="text-sm text-slate-400">Plan</div>
                        <div className="mt-1">{soapNote.P}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-line">
                    {String(soapNote || "SOAP note not available")}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:items-center">
                <div className="w-full sm:w-auto">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={pdfDownloading}
                    className={`inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded w-full sm:w-auto ${pdfDownloading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-emerald-700"
                      }`}
                  >
                    {pdfDownloading ? "Generating PDF..." : "Download PDF"}
                  </button>
                </div>

                <div className="w-full sm:w-auto">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-rose-600 text-white rounded w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConsultationChatView;
