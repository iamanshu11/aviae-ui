import { CheckCircle, Zap, X } from 'lucide-react';

const ToastContainer = ({ toasts = [], removeToast = () => {} }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map((toast) => (
      <div 
        key={toast.id} 
        className="bg-[#131B2C] border border-cyan-500/30 text-white px-4 py-3 rounded-xl shadow-2xl shadow-cyan-900/20 flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto"
      >
        <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
           {toast.type === 'success' ? <CheckCircle size={16} /> : <Zap size={16} />}
        </div>
        <div className="text-sm font-medium">{toast.message}</div>
        <button onClick={() => removeToast(toast.id)} className="ml-2 text-slate-500 hover:text-white"><X size={14}/></button>
      </div>
    ))}
  </div>
);

export default ToastContainer;