import { useState, useEffect, useRef } from "react";
import { useTimer } from "@/hooks/use-timer";
import { GraduationCap, User, Info, Wifi, WifiOff, Battery, BatteryCharging, BatteryLow, RotateCcw, Download, Upload } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { InfoModal } from "@/components/info-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { SimpleConfirmationDialog } from "@/components/new-modals/simple-confirmation-dialog";
import type { UserProfile } from "@/lib/storage";
import { userProfileStorage } from "@/lib/storage";

interface HeaderProps {
  userProfile: UserProfile | null;
  onInfoClick?: () => void;
}

export function Header({ userProfile, onInfoClick }: HeaderProps) {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(
    userProfile,
  );
  const [indiaTime, setIndiaTime] = useState<string>("");
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { isRunning: isTimerRunning } = useTimer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update local profile when prop changes
  useEffect(() => {
    setCurrentProfile(userProfile);
  }, [userProfile]);

  // Update India time every second
  useEffect(() => {
    const updateIndiaTime = () => {
      const now = new Date();
      const indiaTimeString = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setIndiaTime(indiaTimeString);
    };

    updateIndiaTime();
    const interval = setInterval(updateIndiaTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track battery status
  useEffect(() => {
    const updateBatteryStatus = (battery: any) => {
      setBatteryLevel(Math.round(battery.level * 100));
      setIsCharging(battery.charging);
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        updateBatteryStatus(battery);

        battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
        battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
      });
    }
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const handleReset = () => {
    localStorage.clear();
    toast({
      title: "Data Reset",
      description: "All your data has been cleared. Refreshing the page...",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleExport = () => {
    const allData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            allData[key] = JSON.parse(value);
          } catch {
            allData[key] = value;
          }
        }
      }
    }

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jee-study-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been downloaded successfully.",
    });
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        Object.keys(data).forEach(key => {
          const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
          localStorage.setItem(key, value);
        });

        toast({
          title: "Data Imported",
          description: "Your data has been imported successfully. Refreshing the page...",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "The file format is invalid. Please upload a valid JSON file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50 animate-slide-in-left">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-6 min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 sm:space-x-2 group min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-jee-primary to-jee-accent rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                <GraduationCap
                  className="text-white text-sm transition-transform duration-300"
                  size={14}
                />
              </div>
              <h1 className="text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                <span className="hidden sm:inline">JEE Study Manager</span>
                <span className="sm:hidden">JEE Study</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex-shrink-0">
              <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                Time:
              </span>
              <span className="text-xs sm:text-sm font-mono font-semibold text-blue-900 dark:text-blue-100 tabular-nums">
                {indiaTime}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2.5 md:space-x-4 animate-slide-in-right flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onInfoClick}
              className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
              data-testid="button-info"
              title="How to use & About"
            >
              <Info className="text-blue-600 dark:text-blue-400" size={14} />
            </Button>
            <div
              className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-full items-center justify-center"
              data-testid="wifi-status"
              title={isOnline ? "Connected" : "Disconnected"}
            >
              {isOnline ? (
                <Wifi className="text-green-600 dark:text-green-400" size={14} />
              ) : (
                <WifiOff className="text-red-600 dark:text-red-400" size={14} />
              )}
            </div>
            {batteryLevel !== null && (
              <div
                className="hidden sm:flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
                data-testid="battery-status"
                title={isCharging ? `Charging: ${batteryLevel}%` : `Battery: ${batteryLevel}%`}
              >
                {isCharging ? (
                  <BatteryCharging className="text-green-600 dark:text-green-400" size={14} />
                ) : batteryLevel <= 20 ? (
                  <BatteryLow className="text-red-600 dark:text-red-400" size={14} />
                ) : (
                  <Battery className="text-green-600 dark:text-green-400" size={14} />
                )}
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                  {batteryLevel}%
                </span>
              </div>
            )}
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isTimerRunning}>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-jee-secondary to-jee-primary rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isTimerRunning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:shadow-lg cursor-pointer'}`}
                  data-testid="user-avatar"
                  title={isTimerRunning ? "Avatar disabled during study session" : (currentProfile?.name || "User")}
                >
                  {currentProfile?.name ? (
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {getInitials(currentProfile.name)}
                    </span>
                  ) : (
                    <User
                      className="text-white transition-transform duration-300 hover:rotate-12"
                      size={14}
                    />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 sm:w-48">
                <DropdownMenuItem 
                  onClick={() => setShowResetConfirm(true)}
                  className="cursor-pointer text-sm"
                  data-testid="menu-reset"
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                  <span>Reset Data</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleExport}
                  className="cursor-pointer text-sm"
                  data-testid="menu-export"
                >
                  <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                  <span>Export Data</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleImport}
                  className="cursor-pointer text-sm"
                  data-testid="menu-import"
                >
                  <Upload className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                  <span>Import Data</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              data-testid="file-input-import"
            />
          </div>
        </div>
      </div>
      
      <SimpleConfirmationDialog
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset All Data"
        description="Are you sure you want to reset all your data? This will delete all tasks, resources, schedules, notes, and settings. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        variant="destructive"
      />
    </header>
  );
}
