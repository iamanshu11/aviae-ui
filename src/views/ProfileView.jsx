import { useEffect, useState } from 'react';
import { getMyProfile } from '../api-helpers/pharmacist';

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const p = await getMyProfile();
        setProfile(p);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-white">Loading profile...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Pharmacist Profile</h2>
      <div className="space-y-2 text-sm text-slate-300">
        <div><strong>Name:</strong> {profile.name}</div>
        <div><strong>Username:</strong> {profile.username || '-'}</div>
        <div><strong>Email:</strong> {profile.email || '-'}</div>
        <div><strong>Mobile:</strong> {profile.mobile || '-'}</div>
        <div><strong>Address:</strong> {profile.address || '-'}</div>
        <div><strong>GPHC:</strong> {profile.gphc_number}</div>
        <div><strong>Pharmacy ODS:</strong> {profile.pharmacy_ods_code || '-'}</div>
      </div>
    </div>
  );
}
