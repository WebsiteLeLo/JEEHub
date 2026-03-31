import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
});

type UserFormData = z.infer<typeof userSchema>;

interface WelcomeModalProps {
  open: boolean;
  onComplete: (name: string) => void;
}

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: UserFormData) => {
    onComplete(data.name);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md modal-content [&>button]:hidden">
        <div className="modal-header">
          <div className="mx-auto w-20 h-20 modal-icon-container rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-primary via-accent to-secondary">
            <GraduationCap className="text-white" size={36} />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-foreground mb-3">
            Welcome to JEE Study Manager!
          </DialogTitle>
          <p className="text-center text-muted-foreground leading-relaxed">
            Let's personalize your study experience. What should we call you?
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Your Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Enter your name..."
                        className="pl-10 py-3 text-base modal-input"
                        {...field}
                        data-testid="input-user-name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full modal-button bg-gradient-to-r from-primary via-accent to-secondary text-white py-3 text-base font-semibold hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 transition-all duration-300 shadow-lg"
              data-testid="button-save-name"
            >
              Get Started
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          Your information is stored locally on your device and never shared.
        </div>
      </DialogContent>
    </Dialog>
  );
}