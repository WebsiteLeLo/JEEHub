import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { insertResourceSchema } from '@shared/schema';
import { resourceStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { BookOpen } from 'lucide-react';
import type { InsertResource } from '@shared/schema';

interface ResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceCreated?: () => void;
}

export function ResourceModal({ open, onOpenChange, onResourceCreated }: ResourceModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertResource>({
    resolver: zodResolver(insertResourceSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      subject: 'Physics',
      category: 'website',
    },
  });

  const onSubmit = (data: InsertResource) => {
    try {
      const resource = resourceStorage.create(data);
      
      toast({
        title: 'Resource Added',
        description: `Resource "${resource.title}" has been added successfully.`,
      });
      
      form.reset();
      onOpenChange(false);
      onResourceCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add resource. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
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
            <BookOpen className="text-primary" size={28} />
          </div>
          <DialogTitle className="text-xl font-bold text-center text-foreground mb-2">
            Add New Resource
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground leading-relaxed">
            Add a new study resource with URL, subject, and category information.
          </DialogDescription>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter resource title..."
                      className="modal-input"
                      {...field}
                      data-testid="input-resource-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      className="modal-input"
                      {...field}
                      data-testid="input-resource-url"
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
                      <SelectTrigger data-testid="select-resource-subject">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-resource-category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
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
                      placeholder="Add resource description..."
                      className="resize-none modal-input"
                      rows={3}
                      {...field}
                      data-testid="textarea-resource-description"
                    />
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
                data-testid="button-cancel-resource"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto modal-button bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                data-testid="button-add-resource"
              >
                Add Resource
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
