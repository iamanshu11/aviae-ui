import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';

const ConsultationChatView = ({ protocol, onEnd, addToast, metadata = null, consultationData = null, assessmentData = null }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hello. I am initialized for the ${protocol} protocol. Please describe the patient's primary symptoms.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [durationBand, setDurationBand] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientNotes, setPatientNotes] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const responses = [
        "Does the patient have a fever or history of fever in the last 24 hours?",
        "I've noted that. Are there any visible exudates on the tonsils?",
        "Understood. Does the patient have a cough?",
        "Based on the Centor criteria, I recommend checking for tender anterior cervical adenopathy."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'ai', text: randomResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  // Symptoms form helpers
  const toggleSymptom = (label) => {
    setSelectedSymptoms(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const submitSymptoms = async () => {
    if (!consultationData || !consultationData.consultation_id) {
      addToast?.('No consultation active', 'error');
      return;
    }

    if (!durationBand) {
      addToast?.('Please select duration', 'error');
      return;
    }

    const payload = { duration_band: durationBand, symptoms_list: selectedSymptoms, patient_notes: patientNotes };

    try {
      addToast?.('Submitting symptoms...', 'info');
      console.info('ConsultationChatView - submitting symptoms', { consultation_id: consultationData.consultation_id, payload });
      const { updateSymptoms } = await import('../api-helpers/consultation');
      const res = await updateSymptoms(consultationData.consultation_id, payload);
      if (!res.success) throw new Error(res.error || 'Failed to submit symptoms');
      addToast?.('Symptoms submitted', 'success');
      setMessages(prev => [...prev, { role: 'user', text: `Symptoms: ${selectedSymptoms.join(', ')}; Duration: ${durationBand}` }, { role: 'ai', text: 'Thanks — I will review these and ask any follow-up questions.' }]);
      // optionally move to next step or show follow-ups
    } catch (err) {
      console.error('Submit symptoms failed', err);
      addToast?.(err.message || 'Failed to submit symptoms', 'error');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-[#0A0F1E]/90 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Chat Header */}
      <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-[#0F1623]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{protocol}</h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> AI Active
            </p>
          </div>
        </div>
        <button 
          onClick={onEnd}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-rose-500/20 hover:text-rose-400 transition-colors border border-white/5"
        >
          End Session
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-lg' 
                : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Symptoms / questions UI (show when metadata available and no symptoms yet) */}
        {metadata && (!messages.some(m => m.text && m.text.includes('Symptoms:'))) && (
          <div className="p-6 bg-slate-900/90 rounded-2xl border border-white/5 w-full max-w-[780px]">
            <h4 className="text-sm font-semibold text-white mb-2">Clinical questions</h4>

            {/* Duration options */}
            <div className="mb-4">
              <p className="text-xs text-slate-300 mb-2">How long have symptoms been present?</p>
              <div className="flex flex-wrap gap-2">
                {metadata.enums?.duration_band?.map((opt) => (
                  <button key={opt} onClick={() => setDurationBand(opt)} className={`px-3 py-2 rounded-lg text-sm ${durationBand===opt ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom checkboxes */}
            <div className="mb-4">
              <p className="text-xs text-slate-300 mb-2">Select symptoms</p>
              <div className="grid grid-cols-2 gap-2">
                {metadata.symptoms_list?.map((s) => (
                  <label key={s.id || s.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${selectedSymptoms.includes(s.label) ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200 cursor-pointer'}`} onClick={() => toggleSymptom(s.label)}>
                    <input type="checkbox" checked={selectedSymptoms.includes(s.label)} onChange={() => toggleSymptom(s.label)} className="accent-cyan-500" />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <p className="text-xs text-slate-300 mb-2">Patient notes</p>
              <textarea value={patientNotes} onChange={(e) => setPatientNotes(e.target.value)} className="w-full p-3 rounded-lg bg-slate-900 text-slate-200 text-sm h-20" placeholder="e.g. started two days ago, worse at night" />
            </div>

            <div className="flex gap-3">
              <button onClick={submitSymptoms} className="px-4 py-2 bg-green-600 text-white rounded-lg">Submit symptoms</button>
              <button onClick={() => { setDurationBand(''); setSelectedSymptoms([]); setPatientNotes(''); }} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg">Reset</button>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: '0ms'}}/>
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: '150ms'}}/>
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: '300ms'}}/>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0F1623] border-t border-white/10">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response or clinical observation..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl pl-6 pr-14 py-4 text-white focus:border-fuchsia-500 outline-none transition-all placeholder-slate-500"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationChatView;