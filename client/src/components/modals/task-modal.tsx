import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { insertTaskSchema } from '@shared/schema';
import { taskStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare } from 'lucide-react';
import type { InsertTask } from '@shared/schema';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: () => void;
}

const priorityOptions = [
  { value: 'low', label: 'Low', className: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', className: 'bg-red-100 text-red-800' },
] as const;

export function TaskModal({ open, onOpenChange, onTaskCreated }: TaskModalProps) {
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const { toast } = useToast();
  
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: '',
      subject: 'Physics',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = (data: InsertTask) => {
    try {
      const task = taskStorage.create(data);
      
      toast({
        title: 'Task Created',
        description: `Task "${task.title}" has been created successfully.`,
      });
      
      form.reset();
      onOpenChange(false);
      onTaskCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedPriority('medium');
    }
  }, [open, form]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent 
        className="sm:max-w-lg modal-content"
        style={{ zIndex: 51 }}
      >
        <div className="modal-header">
          <div className="mx-auto w-16 h-16 modal-icon-container rounded-2xl flex items-center justify-center mb-4">
            <CheckSquare className="text-primary" size={28} />
          </div>
          <DialogTitle className="text-xl font-bold text-center text-foreground mb-2">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground leading-relaxed">
            Add a new task to your study schedule with subject, priority, and due date.
          </DialogDescription>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title..."
                      className="modal-input"
                      {...field}
                      data-testid="input-task-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-task-subject">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add task description..."
                      className="resize-none modal-input"
                      rows={3}
                      {...field}
                      data-testid="textarea-task-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={today}
                      className="modal-input"
                      {...field}
                      data-testid="input-task-due-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      {priorityOptions.map((option) => (
                        <Badge
                          key={option.value}
                          variant={field.value === option.value ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all hover:opacity-80 ${
                            field.value === option.value ? option.className : ''
                          }`}
                          onClick={() => {
                            field.onChange(option.value);
                            setSelectedPriority(option.value);
                          }}
                          data-testid={`badge-priority-${option.value}`}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto modal-button bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 border-2"
                data-testid="button-cancel-task"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto modal-button bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                data-testid="button-create-task"
              >
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
