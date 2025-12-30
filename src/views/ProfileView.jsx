import { useEffect, useState } from 'react';
import { getMyProfile } from '../api-helpers/pharmacist';
import { Mail, Phone, MapPin, Shield, Briefcase, User, Download } from 'lucide-react';

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md backdrop-blur-sm">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with gradient background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
            <div className="px-6 md:px-8 pb-6 -mt-16 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end md:gap-6 gap-4">
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 border-4 border-slate-800 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 pt-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{profile.name}</h1>
                  <p className="text-cyan-400 font-semibold flex items-center gap-2">
                    <Shield size={18} />
                    Licensed Pharmacist
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'credentials', label: 'Credentials' },
            { id: 'contact', label: 'Contact' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <User size={24} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Username</p>
                    <p className="text-white font-semibold text-lg">{profile.username || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Briefcase size={24} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Pharmacy ODS</p>
                    <p className="text-white font-semibold text-lg">{profile.pharmacy_ods_code || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Credentials Tab */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Shield size={24} className="text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">GPHC Registration Number</p>
                    <p className="text-white font-mono text-2xl font-bold tracking-wider">{profile.gphc_number}</p>
                    <p className="text-slate-500 text-xs mt-2">General Pharmaceutical Council</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Mail size={24} className="text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Email</p>
                    <p className="text-white font-semibold break-all">{profile.email || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-slate-800 border border-slate-700 hover:border-orange-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <Phone size={24} className="text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Mobile</p>
                    <p className="text-white font-semibold text-lg">{profile.mobile || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 group bg-slate-800 border border-slate-700 hover:border-pink-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                    <MapPin size={24} className="text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Address</p>
                    <p className="text-white font-semibold">{profile.address || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}