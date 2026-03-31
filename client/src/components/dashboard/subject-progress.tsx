import { useState } from 'react';
import { Atom, FlaskConical, Calculator, Filter, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal';
import { taskStorage } from '@/lib/storage';
import type { Task, Subject } from '@shared/schema';

const subjectConfig = {
  Physics: {
    icon: Atom,
    color: 'blue',
    bgColor: 'physics-theme',
  },
  Chemistry: {
    icon: FlaskConical,
    color: 'green',
    bgColor: 'chemistry-theme',
  },
  Mathematics: {
    icon: Calculator,
    color: 'purple',
    bgColor: 'mathematics-theme',
  },
};

const statusConfig = {
  completed: { label: 'Completed', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
  'in-progress': { label: 'In Progress', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
  pending: { label: 'Due Today', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
  overdue: { label: 'Overdue', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
};

interface SubjectProgressProps {
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function SubjectProgress({ onTaskUpdate }: SubjectProgressProps) {
  const [tasks, setTasks] = useState<Task[]>(taskStorage.getAll());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const getSubjectData = (subject: Subject) => {
    const subjectTasks = tasks.filter(task => task.subject === subject);
    const completedTasks = subjectTasks.filter(task => task.status === 'completed');
    const pendingTasks = subjectTasks.filter(task => task.status !== 'completed');
    const progress = subjectTasks.length > 0 ? Math.round((completedTasks.length / subjectTasks.length) * 100) : 0;
    
    // Sort tasks: completed tasks go to the bottom
    const sortedTasks = subjectTasks.sort((a, b) => {
      // First, sort by completion status (incomplete tasks first)
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      
      // If both have same completion status, sort by due date
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    return {
      tasks: sortedTasks.slice(0, 3), // Show only first 3 tasks (now sorted)
      total: subjectTasks.length,
      pending: pendingTasks.length,
      progress,
    };
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    const updates = { status: completed ? 'completed' as const : 'pending' as const };
    const updatedTask = taskStorage.update(taskId, updates);
    
    if (updatedTask) {
      setTasks(taskStorage.getAll());
      onTaskUpdate(taskId, updates);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setDeleteModalOpen(true);
    }
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const success = taskStorage.delete(taskToDelete.id);
      if (success) {
        setTasks(taskStorage.getAll());
        onTaskUpdate(taskToDelete.id, {});
      }
      setTaskToDelete(null);
    }
  };

  const getTaskStatus = (task: Task): keyof typeof statusConfig => {
    if (task.status === 'completed') return 'completed';
    if (task.status === 'in-progress') return 'in-progress';
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (dueDate < now) return 'overdue';
    if (dueDate.toDateString() === today.toDateString()) return 'pending';
    
    return 'pending';
  };

  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Subject Progress</CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" data-testid="button-filter">
              <Filter size={16} />
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-more-options">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {(Object.keys(subjectConfig) as Subject[]).map((subject) => {
          const data = getSubjectData(subject);
          const config = subjectConfig[subject];
          const IconComponent = config.icon;
          
          return (
            <div
              key={subject}
              className={`border rounded-xl p-5 hover:shadow-md transition-all duration-300 ${config.bgColor}`}
              data-testid={`subject-section-${subject.toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${config.color}-600 rounded-lg flex items-center justify-center`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{subject}</h4>
                    <p className="text-sm text-jee-muted">
                      {data.total} tasks • {data.pending} pending
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold text-${config.color}-600`} data-testid={`progress-${subject.toLowerCase()}`}>
                    {data.progress}%
                  </div>
                  <div className="text-sm text-jee-muted">Progress</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {data.tasks.length === 0 ? (
                  <div className="text-center py-4 text-jee-muted">
                    <p>No tasks yet. Create your first {subject} task!</p>
                  </div>
                ) : (
                  data.tasks.map((task) => {
                    const status = getTaskStatus(task);
                    const statusInfo = statusConfig[status];
                    
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        data-testid={`task-item-${task.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={task.status === 'completed'}
                            onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                            className="w-4 h-4"
                            data-testid={`checkbox-task-${task.id}`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              task.status === 'completed' ? 'line-through text-jee-muted' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`text-xs ${statusInfo.className}`}
                            data-testid={`badge-status-${task.id}`}
                          >
                            {statusInfo.label}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            data-testid={`button-delete-task-${task.id}`}
                            title="Delete task"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </CardContent>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        itemName={taskToDelete?.title}
      />
    </Card>
  );
}
