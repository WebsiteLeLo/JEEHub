import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertTaskSchema } from '@shared/schema';
import { taskStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import type { InsertTask, Task } from '@shared/schema';

interface SimpleTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
  editTask?: Task | null;
}

export function SimpleTaskModal({ open, onClose, onTaskCreated, editTask }: SimpleTaskModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: '',
      subject: 'Physics',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (editTask) {
      setValue('title', editTask.title);
      setValue('subject', editTask.subject);
      setValue('description', editTask.description || '');
      setValue('priority', editTask.priority);
      setValue('dueDate', editTask.dueDate);
      setValue('estimatedTime', editTask.estimatedTime);
    } else {
      reset({
        title: '',
        subject: 'Physics',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editTask, setValue, reset]);

  const priority = watch('priority');
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = (data: InsertTask) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    setIsSubmitting(true);
    
    // Add a delay to make sure we can see the loading state
    setTimeout(() => {
      try {
        if (editTask) {
          console.log('Calling taskStorage.update...');
          const updatedTask = taskStorage.update(editTask.id, data);
          console.log('Task updated successfully:', updatedTask);
          
          toast({
            title: 'Task Updated',
            description: `Task "${data.title}" has been updated successfully.`,
          });
        } else {
          console.log('Calling taskStorage.create...');
          const task = taskStorage.create(data);
          console.log('Task created successfully:', task);
          
          toast({
            title: 'Task Created',
            description: `Task "${task.title}" has been created successfully.`,
          });
        }
        
        reset();
        onClose();
        onTaskCreated?.();
      } catch (error) {
        console.error('Error saving task:', error);
        toast({
          title: 'Error',
          description: `Failed to ${editTask ? 'update' : 'create'} task: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={editTask ? "Edit Task" : "Create New Task"}
      className="max-w-sm sm:max-w-md lg:max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm sm:text-base">Task Title</Label>
          <Input
            id="title"
            placeholder="Enter task title..."
            {...register('title')}
            className="mt-1 text-sm sm:text-base"
          />
          {errors.title && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subject" className="text-sm sm:text-base">Subject</Label>
          <Select onValueChange={(value) => setValue('subject', value as any)} defaultValue="Physics">
            <SelectTrigger className="mt-1 text-sm sm:text-base">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm sm:text-base">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add task description..."
            rows={3}
            {...register('description')}
            className="mt-1 resize-none text-sm sm:text-base"
          />
          {errors.description && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dueDate" className="text-sm sm:text-base">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            min={today}
            {...register('dueDate')}
            className="mt-1 text-sm sm:text-base"
          />
          {errors.dueDate && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <Label className="text-sm sm:text-base">Priority</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
              { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
              { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('priority', option.value as any)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                  priority === option.value 
                    ? option.color 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.priority && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.priority.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
          >
            {isSubmitting ? (editTask ? 'Updating...' : 'Creating...') : (editTask ? 'Update Task' : 'Create Task')}
          </Button>
        </div>
      </form>
    </SimpleModal>
  );
}