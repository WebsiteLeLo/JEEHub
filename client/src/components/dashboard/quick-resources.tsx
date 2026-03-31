import { useState } from 'react';
import { ExternalLink, Book, Video, Calculator, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resourceStorage } from '@/lib/storage';
import type { Resource } from '@shared/schema';

const categoryIcons = {
  book: Book,
  video: Video,
  tool: Calculator,
  pdf: FileText,
  website: ExternalLink,
};

const categoryColors = {
  book: 'bg-blue-100 text-blue-600',
  video: 'bg-green-100 text-green-600',
  tool: 'bg-purple-100 text-purple-600',
  pdf: 'bg-red-100 text-red-600',
  website: 'bg-gray-100 text-gray-600',
};

interface QuickResourcesProps {
  onAddResource: () => void;
}

export function QuickResources({ onAddResource }: QuickResourcesProps) {
  const [resources] = useState<Resource[]>(resourceStorage.getAll().slice(0, 4));

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-700 p-6 bg-card dark:bg-card">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Resources
          </CardTitle>
          <Button
            onClick={onAddResource}
            variant="ghost"
            size="sm"
            className="text-jee-primary hover:text-blue-700 transition-colors"
            data-testid="button-add-resource"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <div className="space-y-3">
          {resources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ExternalLink className="mx-auto mb-3 opacity-50" size={24} />
              <p className="text-sm">No resources yet</p>
              <p className="text-xs">Add your first resource!</p>
            </div>
          ) : (
            resources.map((resource) => {
              const IconComponent = categoryIcons[resource.category];
              const colorClass = categoryColors[resource.category];
              
              return (
                <button
                  key={resource.id}
                  onClick={() => handleResourceClick(resource.url)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                  data-testid={`resource-${resource.id}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass} dark:bg-opacity-20`}>
                    <IconComponent size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 group-hover:text-primary transition-colors">
                      {resource.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {resource.description || resource.subject}
                    </p>
                  </div>
                  <ExternalLink 
                    size={14} 
                    className="text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors" 
                  />
                </button>
              );
            })
          )}
          
          {/* Default resources shown when no resources exist */}
          {resources.length === 0 && (
            <div className="space-y-3 opacity-60">
              <button
                onClick={() => handleResourceClick('https://www.pw.live/')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Video className="text-green-600 dark:text-green-400" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Physics Wallah</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">JEE Video Lectures</p>
                </div>
                <ExternalLink 
                  size={14} 
                  className="text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors" 
                />
              </button>

              <button
                onClick={() => handleResourceClick('https://jeechallengehub.onrender.com')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
              >
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <ExternalLink className="text-gray-600 dark:text-gray-400" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">JEE Challenge Hub</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Practice & Tests</p>
                </div>
                <ExternalLink 
                  size={14} 
                  className="text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors" 
                />
              </button>

              <button
                onClick={() => handleResourceClick('https://gouravkohad.github.io/ImageSavePDF/')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Calculator className="text-purple-600 dark:text-purple-400" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Image Save PDF</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Convert images to PDF</p>
                </div>
                <ExternalLink 
                  size={14} 
                  className="text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors" 
                />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
