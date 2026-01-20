import React from 'react';
import Card from '../ui/Card';
import { MessageSquare, Heart, Share2, Sparkles } from 'lucide-react';

const CommunityWidget: React.FC = () => {
  const highlights = [
    {
      id: 1,
      author: 'Amira',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amira',
      content: 'Completed 3 weeks of mindfulness therapy! Feeling more centered and peaceful than ever 💫',
      type: 'success',
      time: '2 hours ago',
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      author: 'Coach Sami',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sami',
      content: 'New breathing exercises for stress management now available. Try them during your next session 🌿',
      type: 'resource',
      time: '5 hours ago',
      likes: 42,
      comments: 12
    },
    {
      id: 3,
      author: 'Youssef',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef',
      content: 'Started my journey today. Grateful for this supportive community 🙏',
      type: 'milestone',
      time: '8 hours ago',
      likes: 35,
      comments: 15
    }
  ];

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'success':
        return 'bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200';
      case 'resource':
        return 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200';
      case 'milestone':
        return 'bg-gradient-to-r from-teal-50 to-teal-100/50 border-teal-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <MessageSquare className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900">Community Highlights</h3>
            <p className="text-xs text-gray-500">Latest updates from your community</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-orange-600">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">Trending</span>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {highlights.map((item) => (
          <div 
            key={item.id}
            className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${getTypeStyle(item.type)}`}
          >
            {/* Author Info */}
            <div className="flex items-start gap-3 mb-3">
              <img 
                src={item.avatar}
                alt={item.author}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-blue-900">{item.author}</p>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">{item.content}</p>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-200/50">
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                <Heart size={16} />
                <span>{item.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <MessageSquare size={16} />
                <span>{item.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors ml-auto">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button className="px-4 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
          Share Your Story
        </button>
        <button className="px-4 py-3 bg-white border-2 border-blue-900 text-blue-900 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 active:scale-95">
          Explore Community
        </button>
      </div>
    </Card>
  );
};

export default CommunityWidget;