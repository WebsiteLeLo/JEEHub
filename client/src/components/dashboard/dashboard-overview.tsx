import { Plus, TrendingUp, Target, BookOpen, BarChart3, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { taskStorage, userStatsStorage, type UserProfile } from '@/lib/storage';
import { useMemo } from 'react';
import { TaskExport } from './task-export';

interface DashboardOverviewProps {
  onAddTask: () => void;
  userProfile: UserProfile | null;
}

export function DashboardOverview({ onAddTask, userProfile }: DashboardOverviewProps) {
  const stats = useMemo(() => {
    const userStats = userStatsStorage.get();
    const taskStats = taskStorage.getStats();
    
    return {
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
      studyHours: Math.round(userStats.totalStudyTime / 60 * 10) / 10, // Convert to hours
      streak: userStats.currentStreak,
      completionRate: taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0,
      todayTasks: taskStorage.getAll().filter(t => {
        const today = new Date().toISOString().split('T')[0];
        return t.dueDate === today;
      })
    };
  }, []);

  const progressData = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      progress: Math.min((stats.totalTasks / 20) * 100, 100),
      icon: Target,
      change: `${stats.totalTasks} tasks`,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Study Hours',
      value: `${stats.studyHours}h`,
      progress: Math.min((stats.studyHours / 10) * 100, 100),
      icon: Clock,
      change: `+${stats.studyHours}h total`,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      progress: stats.completionRate,
      icon: BarChart3,
      change: `${stats.completionRate}% done`,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Day Streak',
      value: stats.streak,
      progress: Math.min((stats.streak / 30) * 100, 100),
      icon: Trophy,
      change: `${stats.streak} days`,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-primary">{userProfile?.name || 'Student'}</span>!
          </h2>
          <p className="text-muted-foreground">Track your JEE preparation progress and stay on top of your goals.</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
          <TaskExport tasks={stats.todayTasks} userName={userProfile?.name || 'Student'} />
          <Button
            onClick={onAddTask}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            data-testid="button-add-task"
          >
            <Plus className="mr-2" size={18} />
            <span className="hidden sm:inline">Add New Task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.title}
              className="group relative overflow-hidden p-0 shadow-sm hover:shadow-xl transition-all duration-500 border border-border bg-card hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent size={24} className={`${item.iconColor} transition-colors duration-300`} />
                  </div>
                  <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    <TrendingUp size={14} className="mr-1" />
                    {item.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1 transition-colors duration-300" data-testid={`stat-${item.title.toLowerCase().replace(' ', '-')}`}>
                  {item.value}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 group-hover:text-foreground/80 transition-colors duration-300">{item.title}</p>
                <div className="relative">
                  <Progress 
                    value={item.progress} 
                    className="h-2 bg-muted group-hover:bg-muted/50 transition-all duration-300"
                    data-testid={`progress-${item.title.toLowerCase().replace(' ', '-')}`}
                  />
                  <div className={`absolute inset-0 h-2 rounded-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} 
                       style={{ width: `${item.progress}%` }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
