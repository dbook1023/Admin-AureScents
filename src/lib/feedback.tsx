import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Asynchronous Confirm Modal Implementation ---
export const confirmAction = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const handleClose = (result: boolean) => {
      // Allow dialog exit animation to play before unmounting React tree
      setTimeout(() => {
        root.unmount();
        container.remove();
        resolve(result);
      }, 300);
    };

    const ConfirmDialog = () => {
      const [isOpen, setIsOpen] = useState(true);
      const closeWith = (res: boolean) => {
        setIsOpen(false);
        handleClose(res);
      };

      return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeWith(false); }}>
          <DialogContent className="glass-card max-w-sm w-[95vw] p-0 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden z-[100]">
            <div className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-2 relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-50 transition-opacity"></div>
                <AlertTriangle className="w-8 h-8 text-amber-400 relative z-10" />
              </div>
              
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl font-brand font-black text-white uppercase tracking-widest text-center">
                  Action Required
                </DialogTitle>
                <DialogDescription className="text-white/60 text-xs font-medium leading-relaxed max-w-xs mx-auto text-center">
                  {message}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="w-full grid grid-cols-2 gap-3 mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => closeWith(false)} 
                  className="w-full rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] h-12 transition-premium"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => closeWith(true)}
                  className="w-full rounded-xl bg-[#C5A059] hover:bg-[#E0CA78] text-[#0A192F] font-black uppercase tracking-widest text-[10px] h-12 shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-premium"
                >
                  Confirm
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      );
    };

    root.render(<ConfirmDialog />);
  });
};

// --- Custom Toast Implementation ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Animate in after mount
    requestAnimationFrame(() => setVisible(true));
    
    // Auto-dismiss
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // allow fade out
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      "fixed top-6 right-6 z-[200] transition-all duration-500 transform font-ui",
      visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'
    )}>
      <div className={cn(
        "glass-card flex items-center gap-4 px-5 py-4 rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl min-w-[280px] max-w-md",
        type === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
      )}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
        )}
        <p className="text-white text-xs font-medium tracking-wide flex-1">{message}</p>
        <button onClick={() => setVisible(false)} className="text-white/30 hover:text-white transition-colors ml-2 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const showToast = (message: string, type: 'success' | 'error') => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  
  const handleClose = () => {
    root.unmount();
    container.remove();
  };
  
  root.render(<Toast message={message} type={type} onClose={handleClose} />);
};

export const showSuccess = (message: string): void => showToast(message, 'success');
export const showError = (message: string): void => showToast(message, 'error');
