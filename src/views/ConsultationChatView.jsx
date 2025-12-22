import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';

const ConsultationChatView = ({ protocol, onEnd, addToast }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hello. I am initialized for the ${protocol} protocol. Please describe the patient's primary symptoms.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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