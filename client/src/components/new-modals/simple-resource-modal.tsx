import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertResourceSchema } from '@shared/schema';
import { resourceStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import type { InsertResource } from '@shared/schema';

interface SimpleResourceModalProps {
  open: boolean;
  onClose: () => void;
  onResourceCreated?: () => void;
}

export function SimpleResourceModal({ open, onClose, onResourceCreated }: SimpleResourceModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<InsertResource>({
    resolver: zodResolver(insertResourceSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      subject: 'Physics',
      category: 'website',
    },
  });

  const onSubmit = async (data: InsertResource) => {
    console.log('Resource form submitted with data:', data);
    setIsSubmitting(true);
    try {
      const resource = resourceStorage.create(data);
      console.log('Resource created:', resource);
      
      toast({
        title: 'Resource Added',
        description: `Resource "${resource.title}" has been added successfully.`,
      });
      
      reset();
      onClose();
      onResourceCreated?.();
    } catch (error) {
      console.error('Error creating resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to add resource. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
      title="Add New Resource"
      className="max-w-sm sm:max-w-md lg:max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm sm:text-base">Resource Title</Label>
          <Input
            id="title"
            placeholder="Enter resource title..."
            {...register('title')}
            className="mt-1 text-sm sm:text-base"
          />
          {errors.title && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="url" className="text-sm sm:text-base">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            {...register('url')}
            className="mt-1 text-sm sm:text-base"
          />
          {errors.url && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.url.message}</p>
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
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
          <Select onValueChange={(value) => setValue('category', value as any)} defaultValue="website">
            <SelectTrigger className="mt-1 text-sm sm:text-base">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm sm:text-base">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add resource description..."
            rows={3}
            {...register('description')}
            className="mt-1 resize-none text-sm sm:text-base"
          />
          {errors.description && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.description.message}</p>
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
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base"
          >
            {isSubmitting ? 'Adding...' : 'Add Resource'}
          </Button>
        </div>
      </form>
    </SimpleModal>
  );
}