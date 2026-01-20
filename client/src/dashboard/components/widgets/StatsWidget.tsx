import React from 'react';
import Card from '../ui/Card';
import type { LucideIcon } from 'lucide-react';

interface StatsWidgetProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color?: 'blue' | 'orange' | 'teal' | 'purple';
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  trend,
  color = 'blue' 
}) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-100',
      text: 'text-blue-700'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-100',
      text: 'text-orange-700'
    },
    teal: {
      gradient: 'from-teal-500 to-teal-600',
      bg: 'bg-teal-100',
      text: 'text-teal-700'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-100',
      text: 'text-purple-700'
    }
  };

  const config = colorConfig[color];

  return (
    <Card hover className="p-6 relative overflow-hidden group">
      {/* Decorative Background Element */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      <div className="relative">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="text-white" size={24} />
          </div>
          
          {/* Trend Badge */}
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            trend === 'up' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {change}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
        
        {/* Value */}
        <p className="text-3xl font-bold text-blue-900 mb-1 group-hover:text-blue-800 transition-colors">
          {value}
        </p>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>This month</span>
            <span className="font-semibold">{trend === 'up' ? '↗' : '↘'} {change}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsWidget;