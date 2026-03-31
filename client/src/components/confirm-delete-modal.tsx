import { AlertTriangle } from 'lucide-react';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export function ConfirmDeleteModal({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Delete Task",
  message = "Are you sure you want to delete this task? This action cannot be undone.",
  itemName 
}: ConfirmDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-gray-900">
              {message}
            </p>
            {itemName && (
              <p className="text-sm text-gray-600 mt-1 font-medium">
                "{itemName}"
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            data-testid="button-cancel-delete"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            data-testid="button-confirm-delete"
          >
            Delete Task
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}