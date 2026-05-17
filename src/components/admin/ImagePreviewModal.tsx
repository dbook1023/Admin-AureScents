import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  src?: string | null;
  alt?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ open, onClose, src, alt = 'Preview image' }) => {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] p-0 overflow-hidden bg-[#07111f] border-white/10 rounded-[2rem]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-brand font-black uppercase tracking-widest text-sm">Image Preview</h3>
            <p className="text-white/40 text-xs mt-1">Click outside or close to return.</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 bg-black/30 min-h-[60vh]">
          {src ? (
            <img src={src} alt={alt} className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl border border-white/10" />
          ) : (
            <div className="text-center text-white/40">No image to preview.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
