import { useState } from 'react';
import { createPharmacistAPI, updatePharmacistAPI } from '../../api-helpers/admin';

export default function CreatePharmacistModal({ onClose, onCreated, initial }) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name || '');
  const [username, setUsername] = useState(initial?.username || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [mobile, setMobile] = useState(initial?.mobile || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [gphc, setGphc] = useState(initial?.gphc_number || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name, username, email: email || null, mobile: mobile || null, address: address || null, gphc_number: gphc };
      if (password) payload.password = password;
      if (isEdit) {
        await updatePharmacistAPI(initial.id, payload);
      } else {
        await createPharmacistAPI(payload);
      }
      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(err.message || (isEdit ? 'Failed to update' : 'Failed to create'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold mb-4">{isEdit ? 'Edit Pharmacist' : 'Create Pharmacist'}</h3>
        {error && <div className="p-2 bg-red-600/20 mb-3 rounded">{error}</div>}
        <form onSubmit={handleCreate} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (optional)" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile (optional)" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={gphc} onChange={(e) => setGphc(e.target.value)} placeholder="GPHC number" className="w-full p-2 bg-slate-800 border rounded" />
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Address (optional)" className="w-full p-2 bg-slate-800 border rounded" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (optional)" type="password" className="w-full p-2 bg-slate-800 border rounded" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 rounded text-white">{loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save' : 'Create')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
