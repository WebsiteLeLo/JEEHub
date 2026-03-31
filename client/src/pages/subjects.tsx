import { useState, useEffect } from 'react';
import { Atom, FlaskConical, Calculator, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SimpleTaskModal } from '@/components/new-modals/simple-task-modal';
import { taskStorage, studySessionStorage, userStatsStorage } from '@/lib/storage';
import type { Subject, Task } from '@shared/schema';

const subjectConfig = {
  Physics: {
    icon: Atom,
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50',
    description: 'Master the fundamental laws of nature and their applications',
    topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
  },
  Chemistry: {
    icon: FlaskConical,
    color: 'green',
    bgGradient: 'from-green-500 to-green-600',
    lightBg: 'bg-green-50',
    description: 'Explore the composition, structure, and properties of matter',
    topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Environmental Chemistry'],
  },
  Mathematics: {
    icon: Calculator,
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    lightBg: 'bg-purple-50',
    description: 'Develop logical thinking and problem-solving skills',
    topics: ['Algebra', 'Calculus', 'Geometry', 'Trigonometry', 'Statistics & Probability'],
  },
};

export default function Subjects() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Physics');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(taskStorage.getAll());
  };

  const getSubjectStats = (subject: Subject) => {
    const subjectTasks = tasks.filter(task => task.subject === subject);
    const completedTasks = subjectTasks.filter(task => task.status === 'completed');
    const sessions = studySessionStorage.getBySubject(subject);
    const totalStudyTime = sessions.reduce((acc, session) => acc + session.duration, 0);
    
    const progress = subjectTasks.length > 0 ? (completedTasks.length / subjectTasks.length) * 100 : 0;
    
    return {
      totalTasks: subjectTasks.length,
      completedTasks: completedTasks.length,
      progress: Math.round(progress),
      totalStudyTime: Math.round(totalStudyTime / 60 * 10) / 10, // Convert to hours
      recentTasks: subjectTasks.slice(0, 5),
    };
  };

  const handleTaskCreated = () => {
    loadTasks();
  };

  const overallStats = userStatsStorage.get();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Subjects</h1>
        <p className="text-sm sm:text-base text-jee-muted">Track your progress across Physics, Chemistry, and Mathematics</p>
      </div>

      {/* Subject Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {(Object.keys(subjectConfig) as Subject[]).map((subject) => {
          const config = subjectConfig[subject];
          const stats = getSubjectStats(subject);
          const IconComponent = config.icon;
          
          return (
            <Card
              key={subject}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                selectedSubject === subject ? 'ring-2 ring-jee-primary' : ''
              }`}
              onClick={() => setSelectedSubject(subject)}
              data-testid={`subject-card-${subject.toLowerCase()}`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className={`w-full h-24 sm:h-32 bg-gradient-to-br ${config.bgGradient} rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center`}>
                  <IconComponent className="text-white" size={40} />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-foreground mb-2">{subject}</h3>
                <p className="text-sm text-jee-muted mb-4">{config.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-jee-muted">Progress</span>
                    <span className="font-semibold text-gray-900">{stats.progress}%</span>
                  </div>
                  <Progress value={stats.progress} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{stats.completedTasks}</p>
                      <p className="text-xs text-jee-muted">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{stats.totalStudyTime}h</p>
                      <p className="text-xs text-jee-muted">Study Time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Subject Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Subject Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                {(() => {
                  const IconComponent = subjectConfig[selectedSubject].icon;
                  return <IconComponent className={`text-${subjectConfig[selectedSubject].color}-600`} size={24} />;
                })()}
                <span>{selectedSubject} Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Topics */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {subjectConfig[selectedSubject].topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className={`${subjectConfig[selectedSubject].lightBg} border-${subjectConfig[selectedSubject].color}-200`}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recent Tasks */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Recent Tasks</h4>
                    <Button
                      onClick={() => setIsTaskModalOpen(true)}
                      size="sm"
                      variant="outline"
                      className="text-jee-primary hover:text-blue-700"
                      data-testid="button-add-subject-task"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Task
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {(() => {
                      const stats = getSubjectStats(selectedSubject);
                      return stats.recentTasks.length === 0 ? (
                        <div className="text-center py-8 text-jee-muted">
                          <CheckCircle className="mx-auto mb-3 opacity-50" size={24} />
                          <p className="text-sm">No tasks for {selectedSubject} yet</p>
                          <p className="text-xs">Create your first task to get started!</p>
                        </div>
                      ) : (
                        stats.recentTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 rounded-lg border transition-all hover:shadow-sm ${subjectConfig[selectedSubject].lightBg}`}
                            data-testid={`subject-task-${task.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {task.title}
                                </p>
                                <p className="text-xs text-jee-muted">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge
                                className={
                                  task.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : task.status === 'in-progress'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      );
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Stats Sidebar */}
        <div className="space-y-6">
          {/* Progress Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const stats = getSubjectStats(selectedSubject);
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-jee-muted">Total Tasks</span>
                      <span className="font-semibold">{stats.totalTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-jee-muted">Completed</span>
                      <span className="font-semibold text-green-600">{stats.completedTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-jee-muted">Study Hours</span>
                      <span className="font-semibold text-blue-600">{stats.totalStudyTime}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-jee-muted">Completion Rate</span>
                      <span className="font-semibold">{stats.progress}%</span>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {/* Overall Progress Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subject Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.keys(subjectConfig) as Subject[]).map((subject) => {
                const stats = getSubjectStats(subject);
                const config = subjectConfig[subject];
                
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subject}</span>
                      <span className="text-sm text-jee-muted">{stats.progress}%</span>
                    </div>
                    <Progress 
                      value={stats.progress} 
                      className={`h-2 [&>div]:bg-${config.color}-600`}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Study Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2" size={18} />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-jee-primary mb-2">
                  {overallStats.currentStreak}
                </div>
                <p className="text-sm text-jee-muted">Days in a row</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Modal */}
      <SimpleTaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}