import React, { useEffect, useState } from 'react';
import { Droplet } from 'lucide-react';
import { cn } from "@/lib/utils";
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Perfumes: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [perfumersList, setPerfumersList] = useState<any[]>([]);
  const [notesList, setNotesList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [perfumerName, setPerfumerName] = useState('');
  const [category, setCategory] = useState('Floral');
  const [bestTimeToWear, setBestTimeToWear] = useState('');
  const [topNotes, setTopNotes] = useState('');
  const [middleNotes, setMiddleNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');
  const [mainAccords, setMainAccords] = useState('');
  const [longevity, setLongevity] = useState('');
  const [sillage, setSillage] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [perfumesRes, brandsRes, perfumersRes, notesRes] = await Promise.all([
        supabase.from('perfumes').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('perfume_brands').select('name'),
        supabase.from('perfumers').select('name'),
        supabase.from('perfume_notes').select('name, olfactory_character')
      ]);

      if (perfumesRes.data) setData(perfumesRes.data as any[]);
      if (brandsRes.data) setBrandsList(brandsRes.data);
      if (perfumersRes.data) setPerfumersList(perfumersRes.data);
      if (notesRes.data) setNotesList(notesRes.data);

      if (perfumesRes.error) {
        console.error('Supabase fetch error:', perfumesRes.error.message);
      }
    };

    fetchData();
  }, []);

  const uniqueOlfactoryCharacters = Array.from(new Set(notesList.map(n => n.olfactory_character).filter(Boolean)));

  const handleAdd = () => {
    setEditingItem(null);
    setName('');
    setBrand('');
    setPerfumerName('');
    setCategory('Floral');
    setBestTimeToWear('');
    setTopNotes('');
    setMiddleNotes('');
    setBaseNotes('');
    setMainAccords('');
    setLongevity('');
    setSillage('');
    setShortDescription('');
    setImageUrl('');
    setIsArchived(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name || '');
    setBrand(item.brand || '');
    setPerfumerName(item.perfumer_name || '');
    setCategory(item.category || 'Floral');
    setBestTimeToWear(item.best_time_to_wear || '');
    setTopNotes(Array.isArray(item.top_notes) ? item.top_notes.join(', ') : item.top_notes || '');
    setMiddleNotes(Array.isArray(item.middle_notes) ? item.middle_notes.join(', ') : item.middle_notes || '');
    setBaseNotes(Array.isArray(item.base_notes) ? item.base_notes.join(', ') : item.base_notes || '');
    setMainAccords(Array.isArray(item.main_accords) ? item.main_accords.join(', ') : item.main_accords || '');
    setLongevity(item.longevity || '');
    setSillage(item.sillage || '');
    setShortDescription(item.short_description || '');
    setImageUrl(item.image_url || '');
    setIsArchived(item.is_archived || false);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      brand,
      perfumer_name: perfumerName,
      category,
      best_time_to_wear: bestTimeToWear,
      top_notes: topNotes ? topNotes.split(',').map(n => n.trim()).filter(Boolean) : [],
      middle_notes: middleNotes ? middleNotes.split(',').map(n => n.trim()).filter(Boolean) : [],
      base_notes: baseNotes ? baseNotes.split(',').map(n => n.trim()).filter(Boolean) : [],
      main_accords: mainAccords ? mainAccords.split(',').map(n => n.trim()).filter(Boolean) : [],
      longevity,
      sillage,
      short_description: shortDescription,
      image_url: imageUrl,
      is_archived: isArchived,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('perfumes')
        .update(payload)
        .eq('id', editingItem.id);
      
      if (!error) {
        setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...payload } : item));
        setIsModalOpen(false);
      } else {
        console.error('Failed to update perfume:', error);
      }
    } else {
      const { data: newItems, error } = await supabase
        .from('perfumes')
        .insert([payload])
        .select();

      if (!error && newItems) {
        setData((prev) => [...newItems, ...prev]);
        setIsModalOpen(false);
      } else {
        console.error('Failed to add perfume:', error);
      }
    }
  };

  const columns = [
    { 
      header: 'Fragrance Overview', 
      accessor: (item: any) => (
        <div className="flex items-center gap-5 group/entry">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover/entry:border-[#C5A059]/40 transition-premium shadow-2xl">
            <Droplet className="w-6 h-6 text-white/20 group-hover/entry:text-[#C5A059] transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-brand font-black text-sm tracking-widest uppercase mb-1 group-hover/entry:text-[#C5A059] transition-premium">{item.name}</span>
            <span className="text-[10px] text-white/30 font-brand font-bold uppercase tracking-[0.2em]">{item.brand}</span>
          </div>
        </div>
      )
    },
    { header: 'Perfumer', accessor: (item: any) => <span className="text-[#C5A059] font-brand font-black text-[10px] uppercase tracking-widest">{item.perfumer_name}</span> },
    { header: 'Family', accessor: (item: any) => <span className="text-white/60 font-medium uppercase text-[10px] tracking-[0.2em]">{item.category}</span> },
    { header: 'Best Time', accessor: (item: any) => <span className="text-white/60 font-medium uppercase text-[10px] tracking-[0.2em]">{item.best_time_to_wear}</span> },
    { 
      header: 'Archive', 
      accessor: (item: any) => (
        <span className={cn(
          "inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-brand font-black uppercase tracking-[0.2em] shadow-sm bg-white/5 border",
          item.is_archived ? 'text-white/30 border-white/10' : 'text-emerald-400 border-emerald-500/20'
        )}>
          <div className={cn(
            "w-1.5 h-1.5 rounded-full mr-2",
            item.is_archived ? 'bg-white/20' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
          )}></div>
          {item.is_archived ? 'Archived' : 'Active'}
        </span>
      )
    },
  ];

  return (
    <div className="font-ui">
      <ResourceDataTable 
        title="PERFUME LIBRARY"
        description="Master index of the perfumes table with sample schema-aligned entries."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArchive={async (item) => {
          const { error } = await supabase.from('perfumes').update({ is_archived: true }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: true } : i));
          } else {
            console.error('Failed to archive perfume:', error);
          }
        }}
        searchPlaceholder="Identify entry via signature, house, or notes..."
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update Repository' : 'New Library Accession'}
        description="Comprehensive technical and historical documentation for the global library archive."
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'Commit Changes' : 'Register Accession'}
      >
        <div className="grid gap-12 text-white">
          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
              <Label htmlFor="name">Fragrance Identification</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="brand">Affiliated House (Brand)</Label>
              <Input id="brand" list="brands-list" value={brand} onChange={(event) => setBrand(event.target.value)} />
              <datalist id="brands-list">
                {brandsList.map((b, i) => <option key={i} value={b.name} />)}
              </datalist>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
              <Label>Olfactory Classification</Label>
              <Input list="category-list" value={category} onChange={(event) => setCategory(event.target.value)} />
              <datalist id="category-list">
                {uniqueOlfactoryCharacters.map((c, i) => <option key={i} value={c as string} />)}
              </datalist>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="perfumer">Lead Creator (Nose)</Label>
              <Input id="perfumer" list="perfumers-list" value={perfumerName} onChange={(event) => setPerfumerName(event.target.value)} />
              <datalist id="perfumers-list">
                {perfumersList.map((p, i) => <option key={i} value={p.name} />)}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
              <Label>Best Time to Wear</Label>
              <Input value={bestTimeToWear} onChange={(event) => setBestTimeToWear(event.target.value)} placeholder="Day, Night, Evening" />
            </div>
            <div className="grid gap-3">
              <Label>Current Status</Label>
              <Select value={isArchived ? 'Archived' : 'Active'} onValueChange={(value) => setIsArchived(value === 'Archived')}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10">
            <datalist id="notes-list">
              {notesList.map((n, i) => <option key={i} value={n.name} />)}
            </datalist>
            <div className="grid gap-3">
              <Label>Top Notes</Label>
              <Input list="notes-list" value={topNotes} onChange={(event) => setTopNotes(event.target.value)} placeholder="E.G. Jasmine, Bergamot" />
            </div>
            <div className="grid gap-3">
              <Label>Middle Notes</Label>
              <Input list="notes-list" value={middleNotes} onChange={(event) => setMiddleNotes(event.target.value)} placeholder="E.G. Tuberose, Orris" />
            </div>
            <div className="grid gap-3">
              <Label>Base Notes</Label>
              <Input list="notes-list" value={baseNotes} onChange={(event) => setBaseNotes(event.target.value)} placeholder="E.G. Musk, Sandalwood" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
              <Label>Main Accords</Label>
              <Input value={mainAccords} onChange={(event) => setMainAccords(event.target.value)} placeholder="E.G. White Floral" />
            </div>
            <div className="grid gap-3">
              <Label>Longevity</Label>
              <Input value={longevity} onChange={(event) => setLongevity(event.target.value)} placeholder="E.G. 8-10 hours" />
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Visual Documentation (Image URL)</Label>
            <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="HTTPS://..." />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="desc">Short Description</Label>
            <Textarea id="desc" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder="Historical context and olfactory transition documentation..." className="h-44 rounded-[2rem] p-7 font-medium leading-relaxed resize-none" />
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default Perfumes;
