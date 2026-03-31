import { Play, Pause, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/use-timer';
import { studySessionStorage } from '@/lib/storage';
import { useState } from 'react';
import type { Subject } from '@shared/schema';

const TIMER_PRESETS = [
  { label: '25m', minutes: 25 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
];

export function StudyTimer() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Physics');
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const {
    timeLeft,
    formattedTime,
    isRunning,
    isPaused,
    progress,
    start,
    pause,
    reset,
    setTime,
  } = useTimer(25 * 60);

  const handleStart = () => {
    if (!isRunning && !isPaused) {
      setSessionStartTime(new Date().toISOString());
    }
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleStop = () => {
    if (sessionStartTime) {
      const endTime = new Date().toISOString();
      const startTime = new Date(sessionStartTime);
      const endTimeDate = new Date(endTime);
      const duration = Math.round((endTimeDate.getTime() - startTime.getTime()) / 1000 / 60);

      if (duration > 0) {
        studySessionStorage.create({
          subject: selectedSubject,
          duration,
          startTime: sessionStartTime,
          endTime,
          notes: `${duration} minute study session`,
        });
      }
    }
    
    reset();
    setSessionStartTime(null);
  };

  const handlePresetClick = (minutes: number) => {
    if (!isRunning) {
      setTime(minutes * 60);
    }
  };

  // Calculate stroke dash offset for circular progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <Card className="shadow-sm border border-gray-100 p-6">
      <CardContent className="p-0">
        <div className="text-center">
          <CardTitle className="text-lg font-semibold text-gray-900 mb-4">
            Study Timer
          </CardTitle>
          
          {/* Subject Selector */}
          <div className="mb-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jee-primary"
              disabled={isRunning}
              data-testid="select-timer-subject"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
          
          {/* Timer Display */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="var(--jee-primary)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
                data-testid="timer-progress-circle"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-2xl font-bold text-gray-900"
                  data-testid="timer-display"
                >
                  {formattedTime}
                </div>
                <div className="text-sm text-jee-muted">Study Session</div>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-3 mb-4">
            <Button
              onClick={handleStart}
              disabled={isRunning}
              size="lg"
              className="w-12 h-12 rounded-full jee-primary hover:bg-blue-700 transition-colors"
              data-testid="button-timer-start"
            >
              <Play size={16} />
            </Button>
            <Button
              onClick={handlePause}
              disabled={!isRunning}
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full"
              data-testid="button-timer-pause"
            >
              <Pause size={16} />
            </Button>
            <Button
              onClick={handleStop}
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full"
              data-testid="button-timer-stop"
            >
              <Square size={16} />
            </Button>
          </div>

          {/* Timer Presets */}
          <div className="grid grid-cols-3 gap-2">
            {TIMER_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                onClick={() => handlePresetClick(preset.minutes)}
                disabled={isRunning}
                variant="outline"
                size="sm"
                className="py-2 px-3 text-xs hover:bg-gray-200 transition-colors"
                data-testid={`button-preset-${preset.label}`}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
