import { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Settings, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTimer } from '@/hooks/use-timer';
import { studySessionStorage, type UserProfile } from '@/lib/storage';
import type { Subject } from '@shared/schema';

const TIMER_PRESETS = [
  { label: 'Pomodoro', minutes: 25, description: 'Classic 25-minute focus session' },
  { label: 'Short Break', minutes: 5, description: 'Quick 5-minute break' },
  { label: 'Long Break', minutes: 15, description: 'Extended 15-minute break' },
  { label: 'Focus Block', minutes: 45, description: 'Deep focus 45-minute session' },
  { label: 'Study Hour', minutes: 60, description: 'Full hour study session' },
  { label: 'Quick Review', minutes: 10, description: '10-minute review session' },
];

interface TimerProps {
  userProfile: UserProfile | null;
}

export default function Timer({ userProfile }: TimerProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    userProfile?.preferences.defaultSubject || 'Physics'
  );
  const [selectedPreset, setSelectedPreset] = useState(
    TIMER_PRESETS.find(p => p.minutes === userProfile?.preferences.defaultTimerDuration) || TIMER_PRESETS[0]
  );
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [sessions, setSessions] = useState(studySessionStorage.getAll());
  const [customMinutes, setCustomMinutes] = useState(25);

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
  } = useTimer(selectedPreset.minutes * 60);

  useEffect(() => {
    setTime(selectedPreset.minutes * 60);
  }, [selectedPreset, setTime]);

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
          notes: `${duration} minute ${selectedPreset.label} session`,
        });
        setSessions(studySessionStorage.getAll());
      }
    }
    
    reset();
    setSessionStartTime(null);
  };

  const handleReset = () => {
    reset();
    setSessionStartTime(null);
  };

  const handlePresetClick = (preset: typeof TIMER_PRESETS[0]) => {
    if (!isRunning) {
      setSelectedPreset(preset);
    }
  };

  const handleCustomTime = () => {
    if (!isRunning && customMinutes > 0) {
      setTime(customMinutes * 60);
    }
  };

  // Calculate stroke dash offset for circular progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  const todaysSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });

  const todaysStudyTime = todaysSessions.reduce((acc, session) => acc + session.duration, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Study Timer</h1>
        <p className="text-sm sm:text-base text-jee-muted">Focus on your studies with structured time management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6 md:p-8">
            <CardContent className="p-0">
              {/* Subject Selection */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Study Subject</h3>
                <div className="flex justify-center gap-2">
                  {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((subject) => (
                    <Button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      disabled={isRunning}
                      variant={selectedSubject === subject ? 'default' : 'outline'}
                      className={selectedSubject === subject ? 'jee-primary' : ''}
                      data-testid={`button-subject-${subject.toLowerCase()}`}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Timer Display */}
              <div className="text-center mb-8">
                <div className="relative w-80 h-80 mx-auto mb-6">
                  <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 280 280">
                    <circle
                      cx="140"
                      cy="140"
                      r="120"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="140"
                      cy="140"
                      r="120"
                      stroke="var(--jee-primary)"
                      strokeWidth="12"
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
                        className="text-5xl font-bold text-gray-900 mb-2"
                        data-testid="timer-display"
                      >
                        {formattedTime}
                      </div>
                      <div className="text-lg text-jee-muted">{selectedPreset.label}</div>
                      <div className="text-sm text-jee-muted">{selectedSubject}</div>
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleStart}
                    disabled={isRunning}
                    size="lg"
                    className="w-16 h-16 rounded-full jee-primary hover:bg-blue-700 transition-all transform hover:scale-105"
                    data-testid="button-timer-start"
                  >
                    <Play size={24} />
                  </Button>
                  <Button
                    onClick={handlePause}
                    disabled={!isRunning}
                    variant="outline"
                    size="lg"
                    className="w-16 h-16 rounded-full"
                    data-testid="button-timer-pause"
                  >
                    <Pause size={24} />
                  </Button>
                  <Button
                    onClick={handleStop}
                    disabled={!isRunning && !isPaused}
                    variant="outline"
                    size="lg"
                    className="w-16 h-16 rounded-full"
                    data-testid="button-timer-stop"
                  >
                    <Square size={24} />
                  </Button>
                  <Button
                    onClick={handleReset}
                    disabled={isRunning}
                    variant="outline"
                    size="lg"
                    className="w-16 h-16 rounded-full"
                    data-testid="button-timer-reset"
                  >
                    <RotateCcw size={24} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timer Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timer Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {TIMER_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  disabled={isRunning}
                  variant={selectedPreset.label === preset.label ? 'default' : 'outline'}
                  className={`w-full text-left justify-start ${
                    selectedPreset.label === preset.label ? 'jee-primary' : ''
                  }`}
                  data-testid={`button-preset-${preset.label.toLowerCase().replace(' ', '-')}`}
                >
                  <div>
                    <div className="font-medium">{preset.label}</div>
                    <div className="text-xs opacity-70">{preset.description}</div>
                  </div>
                </Button>
              ))}
              
              {/* Custom Timer */}
              <div className="pt-2 border-t">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                    disabled={isRunning}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Minutes"
                    data-testid="input-custom-minutes"
                  />
                  <Button
                    onClick={handleCustomTime}
                    disabled={isRunning}
                    size="sm"
                    variant="outline"
                    data-testid="button-set-custom"
                  >
                    Set
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2" size={18} />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-jee-primary mb-1">
                  {Math.round(todaysStudyTime / 60 * 10) / 10}h
                </div>
                <p className="text-sm text-jee-muted">Total Study Time</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-jee-muted">Sessions</span>
                  <span className="font-medium">{todaysSessions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-jee-muted">Average</span>
                  <span className="font-medium">
                    {todaysSessions.length > 0 
                      ? Math.round(todaysStudyTime / todaysSessions.length) 
                      : 0}min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysSessions.length === 0 ? (
                  <div className="text-center py-4 text-jee-muted">
                    <Clock className="mx-auto mb-2 opacity-50" size={24} />
                    <p className="text-sm">No sessions today</p>
                    <p className="text-xs">Start your first session!</p>
                  </div>
                ) : (
                  todaysSessions.slice(-5).reverse().map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      data-testid={`session-${session.id}`}
                    >
                      <div>
                        <p className="text-sm font-medium">{session.subject}</p>
                        <p className="text-xs text-jee-muted">
                          {new Date(session.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {session.duration}min
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}