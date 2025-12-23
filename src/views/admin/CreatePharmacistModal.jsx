import { useState } from 'react';
import { createPharmacistAPI } from '../../api-helpers/admin';

export default function CreatePharmacistModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [gphc, setGphc] = useState('');
  const [password, setPassword] = useState('');
  const [permissionsText, setPermissionsText] = useState('{}');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    let permissions = {};
    try {
      permissions = JSON.parse(permissionsText || '{}');
    } catch (err) {
      setError('Permissions must be valid JSON');
      return;
    }
    setLoading(true);
    try {
      const payload = { name, gphc_number: gphc, password, permissions };
      await createPharmacistAPI(payload);
      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold mb-4">Create Pharmacist</h3>
        {error && <div className="p-2 bg-red-600/20 mb-3 rounded">{error}</div>}
        <form onSubmit={handleCreate} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={gphc} onChange={(e) => setGphc(e.target.value)} placeholder="GPHC number" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (optional)" type="password" className="w-full p-2 bg-slate-800 border rounded" />
          <textarea value={permissionsText} onChange={(e) => setPermissionsText(e.target.value)} rows={4} className="w-full p-2 bg-slate-800 border rounded" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 rounded text-white">{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
