import React from 'react';
import { Heart, Star, MapPin, Search, Filter, ShieldCheck } from 'lucide-react';

const UserFavorites: React.FC = () => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Favorite Specialists</h2>
                    <p className="text-gray-500 text-sm mt-1">Access your saved professionals quickly.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search saved..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {['All', 'Psychologists', 'Psychiatrists', 'Therapists'].map((cat, i) => (
                    <button
                        key={cat}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${i === 0 ? 'bg-gray-900 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        {/* Banner & Like */}
                        <div className="h-28 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                            <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all hover:scale-110">
                                <Heart className="fill-current" size={18} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="px-6 pb-6 pt-0 relative">
                            <div className="flex justify-between items-end -mt-10 mb-4">
                                <div className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden relative">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Doc${i}`}
                                        alt="Doctor"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                                    <Star className="text-orange-500 fill-current" size={14} />
                                    <span className="text-sm font-bold text-orange-700">4.9</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">Dr. Example Name</h3>
                                    <ShieldCheck size={16} className="text-blue-500" />
                                </div>
                                <p className="text-blue-600 text-sm font-medium mb-3">Clinical Psychologist</p>

                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>Tunis, Tunisia</span>
                                </div>

                                <button className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 border border-gray-200 hover:border-transparent">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
};

export default UserFavorites;
