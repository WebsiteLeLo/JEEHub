import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, CheckCircle, Clock, AlertCircle, Trash2, AlertTriangle, ArrowUp, Minus, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { SimpleTaskModal } from '@/components/new-modals/simple-task-modal';
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal';
import { taskStorage } from '@/lib/storage';
import type { Task, Subject } from '@shared/schema';

const subjectColors = {
  Physics: 'bg-blue-100 text-blue-800 border-blue-200',
  Chemistry: 'bg-green-100 text-green-800 border-green-200',
  Mathematics: 'bg-purple-100 text-purple-800 border-purple-200',
};

const priorityConfig = {
  high: {
    label: 'High Priority',
    icon: AlertTriangle,
    className: 'bg-red-50 text-red-700 border border-red-200',
    iconColor: 'text-red-600',
    dotColor: 'bg-red-500'
  },
  medium: {
    label: 'Medium Priority',
    icon: ArrowUp,
    className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    iconColor: 'text-yellow-600',
    dotColor: 'bg-yellow-500'
  },
  low: {
    label: 'Low Priority',
    icon: Minus,
    className: 'bg-gray-50 text-gray-700 border border-gray-200',
    iconColor: 'text-gray-600',
    dotColor: 'bg-gray-500'
  }
};

const statusConfig = {
  completed: { 
    label: 'Completed', 
    icon: CheckCircle, 
    className: 'bg-green-100 text-green-800 border-green-200' 
  },
  'in-progress': { 
    label: 'In Progress', 
    icon: Clock, 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
  },
  pending: { 
    label: 'Pending', 
    icon: Clock, 
    className: 'bg-gray-100 text-gray-800 border-gray-200' 
  },
  overdue: { 
    label: 'Overdue', 
    icon: AlertCircle, 
    className: 'bg-red-100 text-red-800 border-red-200' 
  },
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, selectedSubject, selectedStatus]);

  const loadTasks = () => {
    const allTasks = taskStorage.getAll();
    setTasks(allTasks);
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(task => task.subject === selectedSubject);
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    // Sort tasks: completed tasks go to the bottom
    filtered = filtered.sort((a, b) => {
      // First, sort by completion status (incomplete tasks first)
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      
      // If both have same completion status, sort by due date
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredTasks(filtered);
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    const updates = { status: completed ? 'completed' as const : 'pending' as const };
    const updatedTask = taskStorage.update(taskId, updates);
    
    if (updatedTask) {
      loadTasks();
    }
  };

  const handleTaskCreated = () => {
    loadTasks();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
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
        loadTasks();
      }
      setTaskToDelete(null);
    }
  };

  const getTaskStatus = (task: Task): keyof typeof statusConfig => {
    if (task.status === 'completed') return 'completed';
    if (task.status === 'in-progress') return 'in-progress';
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    if (dueDate < now) return 'overdue';
    
    return 'pending';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status !== 'completed').length,
    overdue: tasks.filter(task => {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status !== 'completed';
    }).length,
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Tasks</h1>
          <p className="text-jee-muted">Manage your study tasks and track progress</p>
        </div>
        <Button
          onClick={() => setIsTaskModalOpen(true)}
          className="mt-4 lg:mt-0 bg-jee-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-testid="button-add-task"
        >
          <Plus className="mr-2" size={18} />
          Add New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-blue-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Completed</p>
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-jee-muted">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-tasks"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject | 'All')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jee-primary"
              data-testid="select-filter-subject"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jee-primary"
              data-testid="select-filter-status"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-jee-muted mb-4">
                {tasks.length === 0 
                  ? "Create your first task to get started with your JEE preparation!"
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {tasks.length === 0 && (
                <Button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-jee-primary text-white"
                >
                  <Plus className="mr-2" size={16} />
                  Add Your First Task
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const status = getTaskStatus(task);
            const statusInfo = statusConfig[status];
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card
                key={task.id}
                className="p-4 sm:p-6 hover:shadow-md transition-all duration-200 animate-slide-up"
                data-testid={`task-card-${task.id}`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                    className="mt-1 flex-shrink-0"
                    data-testid={`checkbox-task-${task.id}`}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 
                          className={`text-base sm:text-lg font-semibold break-words ${
                            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-jee-muted mt-1 break-words">{task.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
                        <Badge className={`${statusInfo.className} text-xs`}>
                          <StatusIcon size={12} className="mr-1" />
                          <span className="hidden sm:inline">{statusInfo.label}</span>
                          <span className="sm:hidden">{statusInfo.label.split(' ')[0]}</span>
                        </Badge>
                        <Badge className={`${subjectColors[task.subject]} text-xs`}>
                          {task.subject}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            data-testid={`button-edit-task-${task.id}`}
                            title="Edit task"
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            data-testid={`button-delete-task-${task.id}`}
                            title="Delete task"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-jee-muted">
                        <span>Due: {formatDate(task.dueDate)}</span>
                        {task.estimatedTime && (
                          <span>Est: {task.estimatedTime}min</span>
                        )}
                      </div>
                      
                      {/* Priority Badge */}
                      <div className="flex items-center">
                        {(() => {
                          const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig];
                          const PriorityIcon = priorityInfo.icon;
                          return (
                            <div className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium ${priorityInfo.className}`}>
                              <div className={`w-2 h-2 rounded-full ${priorityInfo.dotColor}`}></div>
                              <PriorityIcon size={12} className={priorityInfo.iconColor} />
                              <span className="capitalize">{task.priority}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Task Modal */}
      <SimpleTaskModal
        open={isTaskModalOpen}
        onClose={handleCloseModal}
        onTaskCreated={handleTaskCreated}
        editTask={editingTask}
      />

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
    </div>
  );
}