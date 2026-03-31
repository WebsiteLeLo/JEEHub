import { Info, BookOpen, Clock, Target, User, CheckCircle, Smartphone, Download } from 'lucide-react';
import { SimpleModal } from '@/components/simple-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

export function InfoModal({ open, onClose }: InfoModalProps) {
  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="How to Use JEE Study Manager"
      size="lg"
    >
      <div className="space-y-6">
        {/* Instructions Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="mr-2 text-blue-600" size={20} />
            Getting Started
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">1</span>
              </div>
              <p><strong>Dashboard:</strong> View your overall progress, study statistics, and weekly goals. Get a quick overview of your JEE preparation.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-semibold text-xs">2</span>
              </div>
              <p><strong>Tasks:</strong> Create, manage, and track your study tasks. Organize by subject (Physics, Chemistry, Mathematics) and set priorities.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-semibold text-xs">3</span>
              </div>
              <p><strong>Subjects:</strong> Monitor progress for each subject individually and see upcoming tasks organized by topic.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 font-semibold text-xs">4</span>
              </div>
              <p><strong>Resources:</strong> Save important study links, reference materials, and useful websites for quick access.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 font-semibold text-xs">5</span>
              </div>
              <p><strong>Timer:</strong> Use study timers with preset durations or custom times. Track your daily study hours automatically.</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="mr-2 text-green-600" size={20} />
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm">Subject-wise task organization</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm">Progress tracking & analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm">Study timer with presets</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm">Resource link management</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm">Dark/Light theme support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-sm">Local data persistence</span>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 text-yellow-600" size={20} />
            Pro Tips
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Set realistic daily goals and track your progress consistently</p>
            <p>• Use the timer feature to maintain focused study sessions</p>
            <p>• Organize tasks by priority and due dates for better time management</p>
            <p>• Regularly review your weekly progress and adjust study plans</p>
            <p>• Keep important resources saved for quick reference during study</p>
          </div>
        </div>

        {/* Author Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <User className="mr-2 text-purple-600" size={20} />
            About the Author
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">GS</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Gourav Saini</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Developer & JEE Preparation Expert</p>
                <Badge className="mt-1 bg-blue-100 text-blue-800 text-xs">App Creator</Badge>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              Designed specifically for JEE aspirants to help organize study time, track progress, 
              and achieve their engineering entrance exam goals efficiently.
            </p>
          </div>
        </div>

        {/* Download Android App Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Smartphone className="mr-2 text-green-600" size={20} />
            Download JeeHub Android App
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Get the Mobile App</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study on the go with the JeeHub Android app</p>
              </div>
              <a
                href="https://drive.google.com/file/d/1i_vyh9UbZVfCqjK-QAXsydJIUVFRCuIV/view"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4"
              >
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  data-testid="button-download-android"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download APK</span>
                  <span className="sm:hidden">Download</span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-close-info"
          >
            Got it, thanks!
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}