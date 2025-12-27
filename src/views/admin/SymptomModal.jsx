import { useState } from 'react';
import { createSymptomAPI, updateSymptomAPI } from '../../api-helpers/admin';

export default function SymptomModal({ onClose, onSaved, initial }) {
  const isEdit = !!initial;
  const [text, setText] = useState(initial?.symptom_text || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!text.trim()) return setError('Symptom is required');
    setLoading(true);
    try {
      const payload = { symptom_text: text };
      if (isEdit) await updateSymptomAPI(initial.id, payload);
      else await createSymptomAPI(payload);
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{isEdit ? 'Edit' : 'Create'} Symptom</h3>
        {error && <div className="p-2 bg-red-600/20 mb-3 rounded">{error}</div>}
        <form onSubmit={handleSave} className="space-y-3">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Symptom text" className="w-full p-2 bg-slate-800 border rounded" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 rounded text-white">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
