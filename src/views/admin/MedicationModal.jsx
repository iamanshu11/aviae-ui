import { useState } from 'react';
import { createMedicationAPI, updateMedicationAPI } from '../../api-helpers/admin';

export default function MedicationModal({ onClose, onSaved, initial }) {
  const isEdit = !!initial;
  const [drugName, setDrugName] = useState(initial?.drug_name || '');
  const [isFirstLine, setIsFirstLine] = useState(!!initial?.is_first_line);
  const [allergy, setAllergy] = useState(initial?.required_allergy_tag || '');
  const [dose, setDose] = useState(initial?.dose_template || '');
  const [course, setCourse] = useState(initial?.course_template || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!drugName.trim()) return setError('Drug name is required');
    setLoading(true);
    try {
      const payload = { drug_name: drugName, is_first_line: isFirstLine, required_allergy_tag: allergy || null, dose_template: dose || null, course_template: course || null };
      if (isEdit) await updateMedicationAPI(initial.id, payload);
      else await createMedicationAPI(payload);
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
        <h3 className="text-lg font-bold mb-4">{isEdit ? 'Edit' : 'Create'} Medication</h3>
        {error && <div className="p-2 bg-red-600/20 mb-3 rounded">{error}</div>}
        <form onSubmit={handleSave} className="space-y-3">
          <input value={drugName} onChange={(e) => setDrugName(e.target.value)} placeholder="Drug name" className="w-full p-2 bg-slate-800 border rounded" />
          <div className="flex items-center gap-2">
            <input id="isFirst" type="checkbox" checked={isFirstLine} onChange={(e) => setIsFirstLine(e.target.checked)} />
            <label htmlFor="isFirst">Is first line</label>
          </div>
          <input value={allergy} onChange={(e) => setAllergy(e.target.value)} placeholder="Required allergy tag (optional)" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="Dose template (optional)" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course template (optional)" className="w-full p-2 bg-slate-800 border rounded" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 rounded text-white">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
