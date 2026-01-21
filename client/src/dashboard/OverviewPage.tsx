import StatsWidget from './components/widgets/StatsWidget';
import MoodStatsWidget from './components/widgets/MoodStatsWidget';
import TherapyProgressWidget from './components/widgets/TherapyProgressWidget';
import CommunityWidget from './components/widgets/CommunityWidget';
import Button from './components/ui/Button';

import {
  Users,
  FileCheck,
  Building2,
  DollarSign,
  Calendar,
  Download
} from 'lucide-react';

const OverviewPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Overview</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Platform statistics and mental health insights
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" icon={<Download size={16} className="sm:w-[18px] sm:h-[18px]" />} className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button icon={<Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />} className="text-xs sm:text-sm">
            <span className="hidden sm:inline">This Month</span>
            <span className="sm:hidden">Month</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatsWidget
          icon={Users}
          title="Total Users"
          value="2,847"
          change="+12.5%"
          trend="up"
          color="blue"
        />
        <StatsWidget
          icon={FileCheck}
          title="Pending Requests"
          value="43"
          change="+8"
          trend="up"
          color="orange"
        />
        <StatsWidget
          icon={Building2}
          title="Active Centers"
          value="18"
          change="+2"
          trend="up"
          color="teal"
        />
        <StatsWidget
          icon={DollarSign}
          title="Revenue"
          value="$12,450"
          change="+18.2%"
          trend="up"
          color="purple"
        />
      </div>

      {/* Main widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
          <TherapyProgressWidget />
          <CommunityWidget />
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <MoodStatsWidget />
        </div>
      </div>

    </div>
  );
};

export default OverviewPage;
