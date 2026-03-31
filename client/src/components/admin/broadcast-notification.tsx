import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BroadcastMessage {
  title: string;
  message: string;
  timestamp: string;
}

interface BroadcastNotificationProps {
  message: BroadcastMessage | null;
  onDismiss: () => void;
}

export function BroadcastNotification({ message, onDismiss }: BroadcastNotificationProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-[100] animate-slide-in-from-top max-w-md"
      data-testid="notification-broadcast"
    >
      <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-0.5">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  {message.title}
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap">
                  {message.message}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
              onClick={onDismiss}
              data-testid="button-dismiss-broadcast"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
