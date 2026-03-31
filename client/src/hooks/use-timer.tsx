import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  totalTime: number;
  endTime: number | null;
}

export function useTimer(initialTime: number = 25 * 60) {
  const [timer, setTimer] = useState<TimerState>(() => {
    const saved = localStorage.getItem('study-timer-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isRunning && parsed.endTime) {
        const remaining = Math.max(0, Math.ceil((parsed.endTime - Date.now()) / 1000));
        return {
          ...parsed,
          timeLeft: remaining,
          isRunning: remaining > 0,
        };
      }
      return parsed;
    }
    return {
      timeLeft: initialTime,
      isRunning: false,
      isPaused: false,
      totalTime: initialTime,
      endTime: null,
    };
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('study-timer-state', JSON.stringify(timer));
  }, [timer]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, []);

  const start = useCallback(() => {
    requestNotificationPermission();
    setTimer(prev => {
      const duration = prev.timeLeft;
      const endTime = Date.now() + duration * 1000;
      return { ...prev, isRunning: true, isPaused: false, endTime };
    });
  }, [requestNotificationPermission]);

  const pause = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: false, isPaused: true, endTime: null }));
  }, []);

  const reset = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      timeLeft: prev.totalTime,
      isRunning: false,
      isPaused: false,
      endTime: null,
    }));
  }, []);

  const setTime = useCallback((time: number) => {
    setTimer(prev => ({
      ...prev,
      timeLeft: time,
      totalTime: time,
      isRunning: false,
      isPaused: false,
      endTime: null,
    }));
  }, []);

  useEffect(() => {
    if (timer.isRunning && timer.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (!prev.endTime) return prev;
          
          const remaining = Math.max(0, Math.ceil((prev.endTime - Date.now()) / 1000));
          
          if (remaining <= 0) {
            sendNotification("Time's Up!", "Your study session has ended.");
            return {
              ...prev,
              timeLeft: 0,
              isRunning: false,
              isPaused: false,
              endTime: null,
            };
          }
          return { ...prev, timeLeft: remaining };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.timeLeft, sendNotification]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const progress = timer.totalTime > 0 ? (timer.totalTime - timer.timeLeft) / timer.totalTime : 0;

  return {
    timeLeft: timer.timeLeft,
    formattedTime: formatTime(timer.timeLeft),
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    progress,
    start,
    pause,
    reset,
    setTime,
  };
}
