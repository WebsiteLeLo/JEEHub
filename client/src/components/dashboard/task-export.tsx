import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Share2, GraduationCap, Target, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@shared/schema';

interface TaskExportProps {
  tasks: Task[];
  userName: string;
}

export function TaskExport({ tasks, userName }: TaskExportProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (exportRef.current === null) return;
    
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#f8fafc',
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        style: {
          visibility: 'visible',
          opacity: '1',
        }
      });
      
      saveAs(dataUrl, `jee-hub-targets-${new Date().toISOString().split('T')[0]}.png`);
      
      toast({
        title: "Targets Exported!",
        description: "Your 1080x1080 target card is ready!",
      });
    } catch (err) {
      console.error('Error exporting image:', err);
      toast({
        title: "Export Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div 
        className="fixed top-0 left-0 pointer-events-none overflow-hidden" 
        style={{ width: '0', height: '0', zIndex: -1000, opacity: 0, position: 'absolute', top: '-2000px' }}
      >
        <div 
          ref={exportRef}
          className="bg-[#f8fafc] flex flex-col text-slate-900 font-inter overflow-hidden relative"
          style={{ width: '1080px', height: '1080px' }}
        >
          <div className="absolute top-[-5%] right-[-5%] w-[70%] h-[70%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[60%] h-[60%] bg-purple-500/10 blur-[110px] rounded-full" />
          <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[90px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 flex flex-col h-full p-16">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[24px] flex items-center justify-center shadow-lg">
                  <GraduationCap size={44} className="text-white" />
                </div>
                <div>
                  <h2 className="text-5xl font-black tracking-tighter leading-none text-slate-900">JEE HUB</h2>
                  <p className="text-lg text-indigo-600 font-black uppercase tracking-[0.4em] mt-2">Study Manager</p>
                </div>
              </div>
              <div className="bg-slate-200/50 border border-slate-200 px-8 py-3 rounded-2xl backdrop-blur-md">
                <p className="text-xl font-bold text-slate-700 tracking-wide">{today}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Sparkles size={28} className="text-amber-500" />
                <span className="text-2xl font-black text-indigo-600/60 tracking-[0.3em] uppercase">Daily Mission</span>
              </div>
              <h3 className="text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-4">
                Today's Targets
              </h3>
              <p className="text-3xl text-slate-700 font-black tracking-tight">
                For <span className="text-indigo-600">{userName}</span>
              </p>
            </div>

            <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
              {tasks.length > 0 ? (
                tasks.slice(0, 10).map((task) => {
                  // Dynamically calculate padding and text sizes based on task count
                  const taskCount = Math.min(tasks.length, 10);
                  const isCompact = taskCount > 4;
                  const isVeryCompact = taskCount > 7;
                  
                  const paddingClass = isVeryCompact ? 'p-2.5' : isCompact ? 'p-3.5' : 'p-6';
                  const titleSize = isVeryCompact ? 'text-base' : isCompact ? 'text-lg' : 'text-2xl';
                  const iconSize = isVeryCompact ? 18 : isCompact ? 22 : 28;
                  const badgeSize = isVeryCompact ? 'text-[8px]' : isCompact ? 'text-[10px]' : 'text-sm';
                  const containerSize = isVeryCompact ? 'w-9 h-9' : isCompact ? 'w-11 h-11' : 'w-14 h-14';

                  return (
                    <div 
                      key={task.id} 
                      className={`bg-white border border-slate-200 shadow-sm rounded-[20px] flex items-center space-x-3 ${paddingClass}`}
                    >
                      <div className={`rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${containerSize} ${
                        task.subject === 'Physics' ? 'bg-blue-100 text-blue-600 border border-blue-200' : 
                        task.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 
                        'bg-amber-100 text-amber-600 border border-amber-200'
                      }`}>
                        <Target size={iconSize} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0">
                          <span className={`font-black px-1.5 py-0 bg-slate-100 rounded-md tracking-widest uppercase text-slate-600 ${badgeSize}`}>{task.subject}</span>
                          <div className="flex items-center space-x-2">
                             <span className={`font-black uppercase px-1.5 py-0 rounded-md ${badgeSize} ${
                                task.priority === 'high' ? 'bg-red-100 text-red-600 border border-red-200' : 
                                task.priority === 'medium' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-blue-100 text-blue-600 border border-blue-200'
                              }`}>
                                {task.priority}
                              </span>
                          </div>
                        </div>
                        <p className={`font-black truncate text-slate-900 tracking-tight ${titleSize}`}>{task.title}</p>
                        {task.description && !isCompact && (
                          <p className="text-base text-slate-500 font-medium truncate italic leading-tight mt-1">{task.description}</p>
                        )}
                      </div>
                      {task.status === 'completed' && (
                        <div className={`${isVeryCompact ? 'w-7 h-7' : isCompact ? 'w-9 h-9' : 'w-12 h-12'} bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200`}>
                          <CheckCircle2 size={isVeryCompact ? 14 : isCompact ? 18 : 24} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-slate-300 text-center space-y-6">
                  <Target size={80} className="opacity-20" />
                  <p className="text-4xl font-black tracking-tight uppercase opacity-50">No targets set</p>
                </div>
              )}
            </div>

            <div className="pt-6 mt-auto border-t border-slate-200 flex flex-col items-center">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-slate-900 rounded-[10px] flex items-center justify-center shadow-lg">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-[0.4em] leading-none uppercase w-full">POWERED BY JEE HUB</p>
              </div>
              <p className="text-sm text-slate-400 font-black tracking-[0.8em] uppercase text-center w-full">JEESTUDYHUB.ONRENDER.COM</p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleExport} 
        disabled={isExporting}
        variant="outline" 
        className="hover-elevate bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300"
        data-testid="button-share-targets"
      >
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="mr-2 h-4 w-4 text-primary" />
        )}
        {isExporting ? 'Generating Image...' : 'Share Targets'}
      </Button>
    </>
  );
}
