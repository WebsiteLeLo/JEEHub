import { useState, useEffect } from 'react';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import { userProfileStorage } from '@/lib/storage';
import { User, Save } from 'lucide-react';
import type { UserProfile } from '@/lib/storage';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (open) {
      const profile = userProfileStorage.get();
      if (profile) {
        setUserProfile(profile);
        setFormData({
          name: profile.name || '',
        });
      }
    }
  }, [open]);

  const handleSaveSettings = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your name.',
        variant: 'destructive',
      });
      return;
    }

    const updatedProfile = userProfileStorage.update({
      name: formData.name.trim(),
      preferences: {
        defaultSubject: userProfile?.preferences?.defaultSubject || 'Physics',
        defaultTimerDuration: userProfile?.preferences?.defaultTimerDuration || 25,
        theme: theme === 'system' ? 'light' : theme,
      },
    });

    if (updatedProfile) {
      toast({
        title: 'Settings Saved',
        description: 'Your name has been updated successfully.',
      });
      onClose();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };


  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="App Settings"
      size="md"
    >
      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h3 className="text-lg font-semibold">Profile</h3>
          </div>
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="mt-1"
              data-testid="input-settings-name"
            />
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            data-testid="button-settings-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="w-full sm:w-auto bg-primary text-primary-foreground"
            data-testid="button-settings-save"
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}