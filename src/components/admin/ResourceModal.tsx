import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
}

const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Commit to Encyclopedia"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-2xl w-[95vw] h-fit max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-[2.5rem] border-white/10 shadow-2xl">
        <DialogHeader className="p-8 pb-6 border-b border-white/5 flex flex-row items-center justify-between">
          <div className="space-y-1 pr-6">
            <DialogTitle className="text-xl font-brand font-black tracking-tight text-white uppercase">{title}</DialogTitle>
            <DialogDescription className="text-white/40 font-medium text-[11px] tracking-wide leading-relaxed">
              {description}
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-premium text-white/30 hover:text-white group"
          >
             <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar-minimal">
          <div className="p-8 pt-6 pb-10 space-y-10">
            {children}
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-white/5 bg-[#0A192F]/60 flex flex-col sm:flex-row gap-3">
          <Button variant="ghost" onClick={onClose} className="glass-button-ghost rounded-xl h-11 px-6">
            Discard Entry
          </Button>
          <Button onClick={onSubmit} className="glass-button-active h-11 px-8 rounded-xl shadow-2xl">
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;
