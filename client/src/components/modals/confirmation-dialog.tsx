import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: 'warning' | 'delete';
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon = 'warning',
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const IconComponent = icon === 'delete' ? Trash2 : AlertTriangle;
  const iconColor = variant === 'destructive' ? 'text-red-500' : 'text-amber-500';
  const iconBgColor = variant === 'destructive' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20';

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent 
        className={`sm:max-w-md modal-content ${variant === 'destructive' ? 'modal-destructive' : 'modal-warning'}`}
        style={{ zIndex: 51 }}
      >
        <div className="modal-header">
          <div className={`mx-auto w-16 h-16 modal-icon-container rounded-2xl flex items-center justify-center mb-4`}>
            <IconComponent className={`${iconColor}`} size={28} />
          </div>
          <DialogTitle className="text-xl font-bold text-center text-foreground mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto modal-button bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 border-2"
            data-testid="button-cancel-confirmation"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={handleConfirm}
            className="w-full sm:w-auto modal-button font-semibold"
            data-testid="button-confirm-action"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}