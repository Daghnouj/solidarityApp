import React from 'react';
import Card from '../ui/Card';
import { Target, TrendingUp } from 'lucide-react';

const TherapyProgressWidget: React.FC = () => {
  const goals = [
    { 
      label: 'Anxiety Management', 
      progress: 75, 
      color: 'blue',
      target: 80,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Sleep Quality', 
      progress: 60, 
      color: 'orange',
      target: 75,
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      label: 'Social Engagement', 
      progress: 85, 
      color: 'teal',
      target: 90,
      gradient: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-md">
            <Target className="text-white" size={20} />
          </div>
          <h3 className="text-lg font-bold text-blue-900">Therapy Progress</h3>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
          <TrendingUp size={14} className="text-green-700" />
          <span className="text-sm font-semibold text-green-700">On Track</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-5">
        {goals.map((goal, index) => (
          <div key={index}>
            {/* Label and Percentage */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-sm font-semibold text-gray-700">{goal.label}</span>
                <p className="text-xs text-gray-500 mt-0.5">Target: {goal.target}%</p>
              </div>
              <span className="text-lg font-bold text-blue-900">{goal.progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              {/* Background track */}
              <div className="absolute inset-0 bg-gray-100"></div>
              
              {/* Filled progress */}
              <div 
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${goal.gradient} transition-all duration-1000 ease-out rounded-full shadow-sm`}
                style={{ 
                  width: `${goal.progress}%`,
                  animation: 'slideIn 1s ease-out'
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>

              {/* Target indicator */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                style={{ left: `${goal.target}%` }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* Progress indicator text */}
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">0%</span>
              <span className="text-xs text-gray-400">100%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Average Progress</p>
          <p className="text-xl font-bold text-blue-900">73%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Goals Achieved</p>
          <p className="text-xl font-bold text-orange-600">1/3</p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
        }
      `}</style>
    </Card>
  );
};

export default TherapyProgressWidget;