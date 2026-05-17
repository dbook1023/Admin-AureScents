import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import { Link, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string; // Kept for backwards compatibility with existing pages
  bucketName?: string; // Kept for backwards compatibility
  imageName?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  imageName = 'image'
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="grid gap-3">
      <Label>{label}</Label>
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 space-y-4 shadow-2xl">
        {value ? (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="w-24 h-24 rounded-[1.5rem] overflow-hidden border border-white/10 bg-black/20 flex items-center justify-center shrink-0 hover:border-[#C5A059]/40 transition-premium cursor-zoom-in group relative"
              title="Open larger preview"
            >
              <div className="absolute inset-0 bg-[#C5A059]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
              <img 
                src={value} 
                alt={imageName} 
                className="w-full h-full object-cover relative z-0" 
                onError={(e) => { 
                  e.currentTarget.src = 'https://placehold.co/400x400/112240/C5A059?text=Invalid+URL'; 
                }} 
              />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">External Image URL</p>
              <p className="text-white/30 text-[10px] break-all mt-1 truncate" title={value}>{value}</p>
              <p className="text-white/30 text-[10px] mt-2 uppercase tracking-[0.2em]">Click image to enlarge</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange('')}
              className="rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-premium"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-white/30">
            <div className="w-24 h-24 rounded-[1.5rem] border border-dashed border-white/15 flex items-center justify-center bg-black/10">
              <ImageIcon className="w-6 h-6 text-white/20" />
            </div>
            <div>
              <p className="text-sm font-brand font-black text-white/50 uppercase tracking-widest">No image URL provided</p>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-1 text-white/30">Enter an external link below</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <div className="relative">
            <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input 
              type="url"
              placeholder="https://example.com/image.jpg"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-12 h-12 bg-black/20 border-white/10 text-white placeholder:text-white/20 rounded-xl focus:border-[#C5A059]/50 transition-premium"
            />
          </div>
          <div className="text-[9px] font-brand font-bold text-white/30 uppercase tracking-[0.25em] pl-1">
            Provide a direct link to a hosted image (JPG, PNG, WebP)
          </div>
        </div>
      </div>

      <ImagePreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        src={value}
        alt={imageName}
      />
    </div>
  );
};

export default ImageUploadField;
