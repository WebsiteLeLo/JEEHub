import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  scrollable?: boolean;
}

export function SimpleModal({ 
  open, 
  onClose, 
  title, 
  children, 
  className = '', 
  size = 'md',
  scrollable = true 
}: SimpleModalProps) {
  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-sm sm:max-w-md',
    lg: 'max-w-sm sm:max-w-md lg:max-w-lg',
    xl: 'max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl'
  };

  const modalSizeClass = `modal-${size}`;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] modal-backdrop overflow-y-auto"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 99999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div 
          className={`modal-content ${scrollable ? 'modal-content-scrollable' : ''} ${modalSizeClass} bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden my-8 ${className}`}
          style={{ 
            zIndex: 100000
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-4">
            {title}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
            data-testid="button-close-modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content - Scrollable */}
        <div className={`${scrollable ? 'overflow-y-auto' : ''} p-4 sm:p-6 max-h-[calc(90vh-120px)]`}>
          {children}
        </div>
      </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}