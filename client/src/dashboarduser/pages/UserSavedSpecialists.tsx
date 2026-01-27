import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw, X } from 'lucide-react';
import UserService from '../services/user.service';
import { useAuth } from '../../pages/auth/hooks/useAuth';

const UserSavedSpecialists: React.FC = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await UserService.getSavedSpecialists(userId);
      setSpecialists(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load saved specialists');
    } finally {
      setLoading(false);
    }
  };

  const unsave = async (professionalId: string) => {
    if (!userId) return;
    try {
      await UserService.unsaveSpecialist(userId, professionalId);
      setSpecialists(prev => prev.filter(p => (p._id || p.id) !== professionalId));
    } catch (e) {
      // ignore for now or show toast
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Saved Specialists</h2>
        <p className="text-gray-500 text-sm mt-1">Professionals you have saved.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="animate-spin text-blue-600" size={32} />
        </div>
      ) : specialists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialists.map((pro) => (
            <div key={pro._id || pro.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                  <img
                    src={pro.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pro.nom || 'User')}`}
                    alt={pro.nom || 'Professional avatar'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{pro.nom}</h3>
                  <p className="text-sm text-gray-500">{pro.specialite || 'Professional'}</p>
                </div>
                <button
                  onClick={() => unsave(pro._id || pro.id)}
                  className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                  title="Remove from saved"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-gray-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No saved specialists</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Explore professionals and save your favorites to find them here later.
          </p>
          <button
            onClick={() => (window.location.href = '/professionals')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Browse Professionals
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default UserSavedSpecialists;
