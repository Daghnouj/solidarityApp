import React from 'react';
import { MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

const UserCommunity: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Community Activity</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    New Post
                </button>
            </div>

            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Me</h3>
                                        <p className="text-xs text-gray-500">Posted 2 days ago</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">Mental Health</span>
                                </div>

                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    Just completed my first week of mindfulness exercises. It's been challenging but rewarding. Has anyone else tried the 10-minute daily routine?
                                </p>

                                <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                        <ThumbsUp size={18} />
                                        <span>12 Likes</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                        <MessageSquare size={18} />
                                        <span>4 Comments</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors ml-auto">
                                        <Share2 size={18} />
                                        <span>Share</span>
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

export default UserCommunity;
