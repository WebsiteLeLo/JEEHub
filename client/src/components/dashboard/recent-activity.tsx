import { useState } from 'react';
import { Check, Clock, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activityStorage } from '@/lib/storage';
import type { Activity } from '@shared/schema';

const activityIcons = {
  task_completed: Check,
  study_session: Clock,
  task_created: Plus,
  resource_added: TrendingUp,
};

const activityColors = {
  task_completed: 'bg-green-100 text-green-600',
  study_session: 'bg-blue-100 text-blue-600',
  task_created: 'bg-purple-100 text-purple-600',
  resource_added: 'bg-yellow-100 text-yellow-600',
};

export function RecentActivity() {
  const [activities] = useState<Activity[]>(activityStorage.getRecent(5));

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="p-6 border-b border-gray-100">
        <CardTitle className="text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-jee-muted">
              <Clock className="mx-auto mb-3 opacity-50" size={24} />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Start studying to see your progress!</p>
            </div>
          ) : (
            activities.map((activity) => {
              const IconComponent = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];
              
              return (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-4 animate-slide-up"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <IconComponent size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-jee-muted">
                      {activity.subject && `${activity.subject} • `}
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Default activities shown when no activities exist */}
          {activities.length === 0 && (
            <div className="space-y-4 opacity-60">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="text-green-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Completed "Kinematics Practice Problems"</p>
                  <p className="text-xs text-jee-muted">Physics • 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="text-blue-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Started study session for Chemistry</p>
                  <p className="text-xs text-jee-muted">3 hours ago • 45 minutes</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="text-purple-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Added new task "Coordinate Geometry Review"</p>
                  <p className="text-xs text-jee-muted">Mathematics • 5 hours ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
