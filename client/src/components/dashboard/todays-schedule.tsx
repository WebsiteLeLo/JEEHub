import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { scheduleStorage } from '@/lib/storage';
import type { ScheduleItem } from '@shared/schema';

const subjectColors = {
  Physics: 'bg-blue-600',
  Chemistry: 'bg-green-600',
  Mathematics: 'bg-purple-600',
};

export function TodaysSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(scheduleStorage.getTodaysSchedule());

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    const updated = scheduleStorage.update(id, { completed });
    if (updated) {
      setSchedule(scheduleStorage.getTodaysSchedule());
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 bg-card dark:bg-card">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="mr-1.5 sm:mr-2" size={16} />
            <span className="truncate">Today's Schedule</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-jee-primary hover:text-blue-700 transition-colors flex-shrink-0"
            data-testid="button-add-schedule"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {schedule.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <Calendar className="mx-auto mb-2 sm:mb-3 opacity-50" size={20} />
              <p className="text-xs sm:text-sm">No schedule for today</p>
              <p className="text-[10px] sm:text-xs">Add your first schedule item!</p>
            </div>
          ) : (
            schedule.map((item) => {
              const colorClass = subjectColors[item.subject];
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg transition-all duration-200 ${
                    item.completed 
                      ? 'bg-gray-100 dark:bg-gray-800 opacity-60' 
                      : item.subject === 'Physics' 
                        ? 'bg-blue-50 dark:bg-blue-950/30' 
                        : item.subject === 'Chemistry' 
                          ? 'bg-green-50 dark:bg-green-950/30' 
                          : 'bg-purple-50 dark:bg-purple-950/30'
                  }`}
                  data-testid={`schedule-item-${item.id}`}
                >
                  <div className={`w-1.5 sm:w-2 h-8 ${colorClass} rounded-full flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-medium truncate ${item.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-200'}`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleComplete(item.id, !item.completed)}
                    className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-auto flex-shrink-0"
                    data-testid={`button-toggle-${item.id}`}
                  >
                    {item.completed ? 'Undo' : 'Done'}
                  </Button>
                </div>
              );
            })
          )}
        </div>
        
        {/* Default schedule items if none exist */}
        {schedule.length === 0 && (
          <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4 opacity-60">
            <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="w-1.5 sm:w-2 h-8 bg-blue-600 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate">Physics Mock Test</p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">10:00 AM - 12:00 PM</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="w-1.5 sm:w-2 h-8 bg-green-600 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate">Chemistry Revision</p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">2:00 PM - 4:00 PM</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="w-1.5 sm:w-2 h-8 bg-purple-600 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate">Math Practice</p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">6:00 PM - 8:00 PM</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
