import { useState, useEffect } from 'react';
import { Send, Users, AlertCircle, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface BroadcastDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BroadcastDialog({ open, onClose }: BroadcastDialogProps) {
  const [title, setTitle] = useState('Admin Message');
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const [sending, setSending] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchActiveUsers();
      setIsAuthenticated(false);
      setAdminPassword('');
    } else {
      setTitle('Admin Message');
      setMessage('');
    }
  }, [open]);

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('/api/admin/active-users');
      const data = await response.json();
      setActiveUsers(data.activeUsers);
    } catch (error) {
      console.error('Failed to fetch active users:', error);
    }
  };

  const handleAuthenticate = () => {
    if (adminPassword === 'admin2025') {
      setIsAuthenticated(true);
      toast({
        title: 'Authenticated',
        description: 'You can now send broadcast messages',
      });
    } else {
      toast({
        title: 'Authentication Failed',
        description: 'Invalid admin password',
        variant: 'destructive',
      });
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message to broadcast',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, message, password: adminPassword }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.success) {
        toast({
          title: 'Broadcast Sent!',
          description: `Message sent to ${data.sentTo} active user${data.sentTo !== 1 ? 's' : ''}`,
        });

        setTitle('Admin Message');
        setMessage('');
        onClose();
      } else {
        throw new Error('Broadcast failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send broadcast message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-admin-broadcast">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Admin Broadcast Panel
          </DialogTitle>
          <DialogDescription>
            {!isAuthenticated 
              ? 'Enter admin password to continue' 
              : 'Send a message to all active users in real-time'}
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Admin Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate()}
                data-testid="input-admin-password"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel-auth"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAuthenticate}
                disabled={!adminPassword}
                className="gap-2"
                data-testid="button-authenticate"
              >
                <Lock className="w-4 h-4" />
                Authenticate
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Active Users</span>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold" data-testid="badge-active-users">
                  {activeUsers}
                </Badge>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="broadcast-title">Title</Label>
                <Input
                  id="broadcast-title"
                  placeholder="Enter broadcast title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-broadcast-title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="broadcast-message">Message</Label>
                <Textarea
                  id="broadcast-message"
                  placeholder="Enter your message to broadcast..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="resize-none"
                  data-testid="textarea-broadcast-message"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={sending}
                data-testid="button-cancel-broadcast"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="gap-2"
                data-testid="button-send-broadcast"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Broadcast'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
