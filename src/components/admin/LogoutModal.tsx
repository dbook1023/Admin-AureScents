import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-sm w-[95vw] p-0 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-2 relative group">
            <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <LogOut className="w-8 h-8 text-red-400 relative z-10" />
          </div>
          
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-brand font-black text-white uppercase tracking-widest text-center">
              Terminate Session
            </DialogTitle>
            <DialogDescription className="text-white/50 text-xs font-medium leading-relaxed max-w-xs mx-auto text-center">
              Are you sure you want to securely log out of the Aure Scents Administrative session? You will need to re-authenticate to access the archives.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full grid grid-cols-2 gap-3 mt-6">
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="w-full rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold uppercase tracking-widest text-xs h-12 transition-premium"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirm}
              className="w-full rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-bold uppercase tracking-widest text-xs h-12 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-premium border border-red-500"
            >
              Log Out
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
