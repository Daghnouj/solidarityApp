import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';

const UserFavorites: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Favorites</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                            <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                                <Heart className="text-white fill-current" size={20} />
                            </button>
                        </div>
                        <div className="p-6 relative">
                            <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 absolute -top-8 left-6 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Doc${i}`} alt="Doctor" />
                            </div>
                            <div className="mt-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Dr. Example Name</h3>
                                        <p className="text-blue-600 text-sm">Psychologist</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-500 text-sm font-bold">
                                        <Star className="fill-current" size={16} />
                                        4.9
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                    <MapPin size={16} />
                                    <span>Tunis, Tunisia</span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button className="w-full py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-colors">
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserFavorites;
