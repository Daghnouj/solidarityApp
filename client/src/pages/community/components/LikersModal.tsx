import React from 'react';
import { X, BadgeCheck } from 'lucide-react';

interface Liker {
    _id: string;
    nom: string;
    photo?: string;
    role: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    likers: Liker[];
}

const LikersModal: React.FC<Props> = ({ isOpen, onClose, likers }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-sm">Post Liked By</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors focus:outline-none"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                    {likers.length > 0 ? (
                        likers.map((liker) => (
                            <div key={liker._id} className="flex items-center gap-3 p-3 hover:bg-blue-50/30 rounded-xl transition-colors group cursor-default">
                                <div className="relative">
                                    <img
                                        src={liker.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(liker.nom)}&background=random&color=fff`}
                                        alt={liker.nom}
                                        className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100 object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <p className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {liker.nom}
                                        </p>
                                        {liker.role === 'professional' && (
                                            <div className="flex items-center gap-1 bg-blue-50/50 px-1.5 py-0.5 rounded-md border border-blue-100/50">
                                                <BadgeCheck className="text-blue-500 w-2.5 h-2.5" strokeWidth={2.5} />
                                                <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider">PRO</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded-md w-fit">
                                        {liker.role === 'patient' ? 'Membre' : liker.role === 'professional' ? '' : liker.role}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-sm text-gray-400 italic font-medium tracking-tight">No likes yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LikersModal;
