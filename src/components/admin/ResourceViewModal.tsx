import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { X, Droplet, User, Tag, Clock, Globe, MapPin, Compass, Calendar, Wind, FileText, UserCheck, Shield, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ResourceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'perfume' | 'perfumer' | 'brand' | 'note' | 'accord';
  item: any;
}

const ResourceViewModal: React.FC<ResourceViewModalProps> = ({
  isOpen,
  onClose,
  type,
  item
}) => {
  if (!item) return null;

  // Custom styling elements based on resource type
  const getTitleAndDesc = () => {
    switch (type) {
      case 'perfume':
        return {
          title: "Perfume Dossier",
          desc: "Complete scientific, olfactory, and catalog details of the fragrance asset."
        };
      case 'perfumer':
        return {
          title: "Perfumer Master Profile",
          desc: "Biographical details and professional archives of the olfactory master."
        };
      case 'brand':
        return {
          title: "Fragrance House Archives",
          desc: "Historical background, operational origins, and profile details."
        };
      case 'note':
        return {
          title: "Olfactory Note Profile",
          desc: "Molecular classification, intensity index, and seasonal suitability."
        };
      case 'accord':
        return {
          title: "Harmonic Accord Definition",
          desc: "Structural composition and olfactory resonance of curated note blends."
        };
    }
  };

  const { title, desc } = getTitleAndDesc();

  // Helpers to parse lists
  const parseNotes = (notesField: any): string[] => {
    if (!notesField) return [];
    if (Array.isArray(notesField)) return notesField.filter(Boolean);
    return String(notesField).split(',').map(n => n.trim()).filter(Boolean);
  };

  const parseAccords = (accordsField: any): string[] => {
    if (!accordsField) return [];
    if (Array.isArray(accordsField)) return accordsField.filter(Boolean);
    return String(accordsField).split(',').map(n => n.trim()).filter(Boolean);
  };

  // Prevent javascript: URI XSS
  const getSafeUrl = (url: string) => {
    if (!url) return '#';
    try {
      const parsedUrl = new URL(url.includes('://') ? url : `https://${url}`);
      return ['http:', 'https:'].includes(parsedUrl.protocol) ? parsedUrl.href : '#';
    } catch {
      return '#';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card max-w-4xl w-[95vw] h-fit max-h-[92vh] overflow-hidden flex flex-col p-0 rounded-[2.5rem] border border-white/10 shadow-2xl text-white">
        
        {/* Header */}
        <DialogHeader className="p-8 pb-5 border-b border-white/5 flex flex-row items-center justify-between shrink-0">
          <div className="space-y-1 pr-6">
            <span className="text-[10px] font-brand font-black uppercase tracking-[0.3em] text-[#C5A059] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AURE SCENTS SCHOLARLY ARCHIVE
            </span>
            <DialogTitle className="text-2xl font-brand font-black tracking-tight text-white uppercase mt-1">
              {title}
            </DialogTitle>
            <DialogDescription className="text-white/40 font-medium text-[11px] tracking-wide leading-relaxed">
              {desc}
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close Dossier"
            aria-label="Close Dossier"
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-premium text-white/30 hover:text-white group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </DialogHeader>

        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar-minimal p-8 md:p-10">
          
          {/* Main Grid: Left for Visual, Right for Data */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Visual Section (Col span 5) */}
            <div className="md:col-span-5 flex flex-col gap-5">
              {/* Premium image panel or luxury monogram placeholder */}
              {(type === 'perfume' || type === 'note') && item.image_url ? (
                <div className="relative group/img aspect-square md:aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-premium hover:border-[#C5A059]/40">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                  />
                  {/* Premium overlay with subtle shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Category/Gender display at the bottom of the image */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                    {item.category && (
                      <span className="backdrop-blur-md bg-white/10 border border-white/10 text-white font-brand font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-lg">
                        {item.category}
                      </span>
                    )}
                    {item.gender && (
                      <span className="backdrop-blur-md bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#E2C792] font-brand font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-lg">
                        {item.gender}
                      </span>
                    )}
                    {item.olfactory_character && (
                      <span className="backdrop-blur-md bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#E2C792] font-brand font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-lg">
                        {item.olfactory_character}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* High-end luxury placeholder monogram with golden halo */
                <div className="relative aspect-square md:aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c182b] via-[#050d18] to-[#1a2d48] flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8">
                  {/* Glow circle background */}
                  <div className="absolute w-44 h-44 rounded-full bg-[#C5A059]/5 blur-[60px]" />
                  
                  {/* Concentric rings */}
                  <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center mb-4 relative z-10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
                    <div className="w-20 h-20 rounded-full border border-[#C5A059]/20 flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                      <span className="text-3xl font-serif font-black text-white group-hover:scale-110 transition-transform">
                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  </div>

                  <span className="text-white font-brand font-black uppercase text-[10px] tracking-[0.3em] text-center z-10 opacity-60">
                    {type === 'perfumer' ? 'Master Nose Archive' : type === 'brand' ? 'Fragrance House' : 'Olfactory Accord'}
                  </span>
                  
                  {item.country && (
                    <span className="mt-2 text-[#C5A059] font-brand font-black text-[9px] uppercase tracking-[0.2em] z-10 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.country}
                    </span>
                  )}
                </div>
              )}

              {/* Status Indicator */}
              <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <span className="text-[9px] font-brand font-black uppercase tracking-[0.25em] text-white/30 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-white/20" /> Repository Registry
                </span>
                <span className={cn(
                  "inline-flex items-center rounded-xl px-4 py-1.5 text-[9px] font-brand font-black uppercase tracking-[0.2em] shadow-sm bg-white/5 border",
                  item.is_archived ? 'text-white/30 border-white/10' : 'text-emerald-400 border-emerald-500/20'
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mr-2",
                    item.is_archived ? 'bg-white/20' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                  )}></div>
                  {item.is_archived ? 'Archived' : 'Active Registry'}
                </span>
              </div>
            </div>

            {/* Information Section (Col span 7) */}
            <div className="md:col-span-7 flex flex-col gap-8">
              
              {/* Product Title / House Header */}
              <div>
                {type === 'perfume' && (
                  <span className="text-[10px] font-brand font-black uppercase tracking-[0.25em] text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg border border-[#C5A059]/20">
                    {item.brand || 'Independent House'}
                  </span>
                )}
                {type === 'note' && (
                  <span className="text-[10px] font-brand font-black uppercase tracking-[0.25em] text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg border border-[#C5A059]/20">
                    {item.olfactory_character || 'Olfactory Note'}
                  </span>
                )}
                {type === 'perfumer' && (
                  <span className="text-[10px] font-brand font-black uppercase tracking-[0.25em] text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg border border-[#C5A059]/20">
                    Master Creator
                  </span>
                )}
                {type === 'brand' && (
                  <span className="text-[10px] font-brand font-black uppercase tracking-[0.25em] text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg border border-[#C5A059]/20">
                    Fragrance Institution
                  </span>
                )}
                {type === 'accord' && (
                  <span className="text-[10px] font-brand font-black uppercase tracking-[0.25em] text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg border border-[#C5A059]/20">
                    Olfactory Chord
                  </span>
                )}
                <h2 className="text-3xl font-brand font-black tracking-widest uppercase text-white mt-3 leading-none">
                  {item.name}
                </h2>
                {item.perfumer_name && (
                  <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C5A059]" /> Nose: <span className="text-white font-bold">{item.perfumer_name}</span>
                  </p>
                )}
              </div>

              {/* Dynamic Metadata Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 pt-6">
                {type === 'perfume' && (
                  <>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#C5A059]" /> Classification
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.category || 'N/A'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#C5A059]" /> Demography
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.gender || 'Unisex'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A059]" /> Best Wear
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.best_time_to_wear || 'Daily'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-[#C5A059]" /> Longevity
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.longevity || 'Moderate'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 col-span-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Wind className="w-3 h-3 text-[#C5A059]" /> Sillage
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.sillage || 'Moderate'}</span>
                    </div>
                  </>
                )}

                {type === 'note' && (
                  <>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Compass className="w-3 h-3 text-[#C5A059]" /> Olfactory Class
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.olfactory_character || 'N/A'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-[#C5A059]" /> Intensity
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.intensity || 'Medium'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C5A059]" /> Ideal Season
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.season || 'Daily'}</span>
                    </div>
                  </>
                )}

                {type === 'brand' && (
                  <>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C5A059]" /> Headquarters
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.country || 'N/A'}</span>
                    </div>
                    {item.website_url && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 col-span-2 sm:col-span-2">
                        <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                          <Globe className="w-3 h-3 text-[#C5A059]" /> Digital Flagship
                        </span>
                        <a 
                          href={getSafeUrl(item.website_url)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] uppercase text-[#C5A059] hover:text-[#E0CA78] font-bold tracking-widest truncate block transition-colors"
                        >
                          {item.website_url}
                        </a>
                      </div>
                    )}
                  </>
                )}

                {type === 'accord' && (
                  <>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#C5A059]" /> Profile Type
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.type || 'N/A'}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 col-span-2 sm:col-span-2">
                      <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                        <Compass className="w-3 h-3 text-[#C5A059]" /> Curation Status
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.1em]">{item.status || 'Curated'}</span>
                    </div>
                  </>
                )}

                {type === 'perfumer' && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 col-span-3">
                    <span className="text-[8px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" /> Signature Authority
                    </span>
                    <span className="text-[10px] font-brand font-black uppercase text-white tracking-[0.15em]">
                      Master nose registered in Aure Scents Archives
                    </span>
                  </div>
                )}
              </div>

              {/* Perfume Specific Details: Notes & Accords */}
              {(type === 'perfume' || type === 'accord') && (
                <div className="space-y-6 border-t border-white/5 pt-6">
                  {/* Accords (for perfumes) or Notes (for accords) */}
                  {(type === 'perfume' ? parseAccords(item.main_accords) : parseNotes(item.notes)).length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] font-brand font-black text-white/40 uppercase tracking-[0.25em]">
                        {type === 'perfume' ? 'Harmonic Accords' : 'Structural Components'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(type === 'perfume' ? parseAccords(item.main_accords) : parseNotes(item.notes)).map((component, idx) => (
                          <span 
                            key={idx} 
                            className="bg-white/[0.03] hover:bg-[#C5A059]/10 border border-white/10 hover:border-[#C5A059]/30 text-white font-brand font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-xl transition-all shadow-[inset_0_0_10px_rgba(255,255,255,0.01)]"
                          >
                            {component}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pyramidal Olfactory Structure for Perfumes */}
                  {type === 'perfume' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                      {/* Top Notes */}
                      <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                          <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                          <span className="text-[9px] font-brand font-black text-[#C5A059] uppercase tracking-[0.2em]">Top Notes</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {parseNotes(item.top_notes).length > 0 ? (
                            parseNotes(item.top_notes).map((note, idx) => (
                              <span key={idx} className="text-white/80 font-bold uppercase text-[9px] tracking-wider truncate">
                                • {note}
                              </span>
                            ))
                          ) : (
                            <span className="text-white/20 text-[9px] italic">Not registered</span>
                          )}
                        </div>
                      </div>

                      {/* Middle Notes */}
                      <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                          <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                          <span className="text-[9px] font-brand font-black text-[#C5A059] uppercase tracking-[0.2em]">Heart Notes</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {parseNotes(item.middle_notes).length > 0 ? (
                            parseNotes(item.middle_notes).map((note, idx) => (
                              <span key={idx} className="text-white/80 font-bold uppercase text-[9px] tracking-wider truncate">
                                • {note}
                              </span>
                            ))
                          ) : (
                            <span className="text-white/20 text-[9px] italic">Not registered</span>
                          )}
                        </div>
                      </div>

                      {/* Base Notes */}
                      <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                          <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                          <span className="text-[9px] font-brand font-black text-[#C5A059] uppercase tracking-[0.2em]">Base Notes</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {parseNotes(item.base_notes).length > 0 ? (
                            parseNotes(item.base_notes).map((note, idx) => (
                              <span key={idx} className="text-white/80 font-bold uppercase text-[9px] tracking-wider truncate">
                                • {note}
                              </span>
                            ))
                          ) : (
                            <span className="text-white/20 text-[9px] italic">Not registered</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rich Texts (Descriptions / Histories / Bios) */}
              <div className="space-y-6 border-t border-white/5 pt-6">
                
                {/* Short Descriptions or Intro Biographies */}
                {((type === 'perfume' && (item.short_description || item.description)) || 
                  (type === 'note' && item.description)) && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-brand font-black text-white/40 uppercase tracking-[0.25em] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-white/20" /> Executive olfactive summary
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-white/70 italic bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                      "{item.short_description || item.description || item.history}"
                    </p>
                  </div>
                )}

                {/* Main Encyclopedia Entries / full biographies */}
                {type === 'perfume' && item.full_description && (
                  <div className="space-y-3 bg-[#0A192F]/60 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <span className="text-[9px] font-brand font-black text-[#C5A059] uppercase tracking-[0.25em]">ENCYCLOPEDIC REGISTRY RECORD</span>
                    <p className="text-[12px] font-medium leading-loose text-white/80 whitespace-pre-line">
                      {item.full_description}
                    </p>
                  </div>
                )}

                {type === 'perfumer' && item.bio && (
                  <div className="space-y-3 bg-[#0A192F]/60 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <span className="text-[9px] font-brand font-black text-[#C5A059] uppercase tracking-[0.25em] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> BIOGRAPHICAL CHRONICLE
                    </span>
                    <p className="text-[12px] font-medium leading-loose text-white/80 whitespace-pre-line">
                      {item.bio}
                    </p>
                  </div>
                )}

                {type === 'brand' && item.history && (
                  <div className="space-y-3 bg-[#0A192F]/60 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <span className="text-[9px] font-brand font-black text-[#C5A059] uppercase tracking-[0.25em] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> INSTITUTIONAL HERITAGE & EVOLUTION
                    </span>
                    <p className="text-[12px] font-medium leading-loose text-white/80 whitespace-pre-line">
                      {item.history}
                    </p>
                  </div>
                )}

                {/* If note has NO description, or anything else has NO details */}
                {((type === 'perfume' && !item.short_description && !item.full_description) ||
                  (type === 'perfumer' && !item.bio) ||
                  (type === 'brand' && !item.history) ||
                  (type === 'note' && !item.description) ||
                  (type === 'accord')) && (
                  <p className="text-xs font-medium text-white/30 italic">No historical or encyclopedic documentation is currently registered for this archive entry.</p>
                )}
              </div>

            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceViewModal;
