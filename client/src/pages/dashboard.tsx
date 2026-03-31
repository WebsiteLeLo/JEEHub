import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { SubjectProgress } from '@/components/dashboard/subject-progress';
import { StudyTimer } from '@/components/dashboard/study-timer';
import { TodaysSchedule } from '@/components/dashboard/todays-schedule';
import { QuickResources } from '@/components/dashboard/quick-resources';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { SimpleTaskModal } from '@/components/new-modals/simple-task-modal';
import { SimpleResourceModal } from '@/components/new-modals/simple-resource-modal';

import { Button } from '@/components/ui/button';
import type { UserProfile, WeeklyProgress } from '@/lib/storage';
import { weeklyProgressStorage } from '@/lib/storage';

interface DashboardProps {
  userProfile: UserProfile | null;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);

  // Load weekly progress data
  useEffect(() => {
    const loadProgress = () => {
      const progress = weeklyProgressStorage.get();
      setWeeklyProgress(progress);
    };
    
    loadProgress();
  }, [refreshKey]);

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleResourceCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
      <DashboardOverview 
        onAddTask={() => setIsTaskModalOpen(true)} 
        userProfile={userProfile}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          <SubjectProgress 
            key={`subject-${refreshKey}`}
            onTaskUpdate={handleTaskUpdate} 
          />
          <RecentActivity key={`activity-${refreshKey}`} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <StudyTimer />
          <TodaysSchedule key={`schedule-${refreshKey}`} />
          <QuickResources 
            key={`resources-${refreshKey}`}
            onAddResource={() => setIsResourceModalOpen(true)} 
          />
          
          {/* Weekly Progress Card */}
          <div className="bg-white dark:bg-card rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-foreground mb-3 sm:mb-4">Weekly Progress</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-jee-muted">Physics</span>
                <span className="text-sm font-medium">{weeklyProgress?.Physics || 0}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full progress-bar" 
                  style={{ width: `${weeklyProgress?.Physics || 0}%` }} 
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-jee-muted">Chemistry</span>
                <span className="text-sm font-medium">{weeklyProgress?.Chemistry || 0}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full progress-bar" 
                  style={{ width: `${weeklyProgress?.Chemistry || 0}%` }} 
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-jee-muted">Mathematics</span>
                <span className="text-sm font-medium">{weeklyProgress?.Mathematics || 0}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full progress-bar" 
                  style={{ width: `${weeklyProgress?.Mathematics || 0}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50">
        <Button
          onClick={() => setIsTaskModalOpen(true)}
          size="lg"
          className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-jee-primary to-jee-accent text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-float"
          data-testid="fab-add-task"
        >
          <Plus size={20} className="sm:w-6 sm:h-6" />
        </Button>
      </div>
      
      
      {/* Modals */}
      <SimpleTaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
      
      <SimpleResourceModal
        open={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onResourceCreated={handleResourceCreated}
      />
    </div>
  );
}
