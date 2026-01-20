import React from 'react';
import Card from '../ui/Card';
import { Heart, TrendingUp } from 'lucide-react';

const MoodStatsWidget: React.FC = () => {
  return (
    <Card hover className="p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative">
        {/* Icon */}
        <div className="mb-4">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
            <Heart className="text-white" size={24} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm text-gray-600 font-medium mb-2">Mood Score</h3>
        
        {/* Main Value */}
        <div className="flex items-end gap-2 mb-3">
          <div className="text-4xl font-bold text-blue-900">8.4</div>
          <div className="text-xl text-gray-400 mb-1">/10</div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100">
            <TrendingUp size={14} className="text-green-700" />
            <span className="text-sm font-semibold text-green-700">+12%</span>
          </div>
          <span className="text-xs text-gray-500">vs last week</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-4 pt-4 border-t border-gray-100">
          Your overall mood is positive! Keep up the great work 😊
        </p>
      </div>
    </Card>
  );
};

export default MoodStatsWidget;