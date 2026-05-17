import React, { useEffect, useState } from 'react';
import { Droplet } from 'lucide-react';
import { cn } from "@/lib/utils";
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import ImageUploadField from '@/components/admin/ImageUploadField';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import ResourceViewModal from '@/components/admin/ResourceViewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { confirmAction, showError, showSuccess } from '@/lib/feedback';

const Perfumes: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [perfumersList, setPerfumersList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [perfumerId, setPerfumerId] = useState('');
  const [perfumerName, setPerfumerName] = useState('');
  const [category, setCategory] = useState('Designer');
  const [bestTimeToWear, setBestTimeToWear] = useState('');
  const [gender, setGender] = useState('Unisex');
  const [topNotes, setTopNotes] = useState<string[]>(['']);
  const [middleNotes, setMiddleNotes] = useState<string[]>(['']);
  const [baseNotes, setBaseNotes] = useState<string[]>(['']);
  const [mainAccords, setMainAccords] = useState('');
  const [longevity, setLongevity] = useState('');
  const [sillage, setSillage] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [encyclopediaEntry, setEncyclopediaEntry] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [viewingItem, setViewingItem] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [perfumesRes, brandsRes, perfumersRes] = await Promise.all([
        supabase.from('perfumes').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('perfume_brands').select('name'),
        supabase.from('perfumers').select('id, name')
      ]);

      if (perfumesRes.data) setData(perfumesRes.data as any[]);
      if (brandsRes.data) setBrandsList(brandsRes.data);
      if (perfumersRes.data) setPerfumersList(perfumersRes.data);

      if (perfumesRes.error) {
        console.error('Supabase fetch error:', perfumesRes.error.message);
      }
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setName('');
    setBrand('');
    setPerfumerId('');
    setPerfumerName('');
    setCategory('Designer');
    setBestTimeToWear('');
    setTopNotes(['']);
    setMiddleNotes(['']);
    setBaseNotes(['']);
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
    setPerfumerId(item.perfumer_id || '');
    setPerfumerName(item.perfumer_name || '');
    setCategory(item.category || 'Designer');
    setBestTimeToWear(item.best_time_to_wear || '');
    setGender(item.gender || 'Unisex');
    const nextTopNotes = Array.isArray(item.top_notes) ? item.top_notes.map((note: string) => note || '').filter(Boolean).slice(0, 5) : item.top_notes ? String(item.top_notes).split(',').map((note: string) => note.trim()).filter(Boolean).slice(0, 5) : [];
    const nextMiddleNotes = Array.isArray(item.middle_notes) ? item.middle_notes.map((note: string) => note || '').filter(Boolean).slice(0, 5) : item.middle_notes ? String(item.middle_notes).split(',').map((note: string) => note.trim()).filter(Boolean).slice(0, 5) : [];
    const nextBaseNotes = Array.isArray(item.base_notes) ? item.base_notes.map((note: string) => note || '').filter(Boolean).slice(0, 5) : item.base_notes ? String(item.base_notes).split(',').map((note: string) => note.trim()).filter(Boolean).slice(0, 5) : [];
    setTopNotes(nextTopNotes.length ? nextTopNotes : ['']);
    setMiddleNotes(nextMiddleNotes.length ? nextMiddleNotes : ['']);
    setBaseNotes(nextBaseNotes.length ? nextBaseNotes : ['']);
    setMainAccords(Array.isArray(item.main_accords) ? item.main_accords.join(', ') : item.main_accords || '');
    setLongevity(item.longevity || '');
    setSillage(item.sillage || '');
    setShortDescription(item.short_description || item.description || '');
    setEncyclopediaEntry(item.full_description || '');
    setImageUrl(item.image_url || '');
    setIsArchived(item.is_archived || false);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!await confirmAction(editingItem ? 'Save changes to this perfume?' : 'Create this perfume?')) {
      return;
    }

    const payload = {
      name,
      brand,
      perfumer_id: perfumerId || null,
      perfumer_name: perfumerName,
      category,
      best_time_to_wear: bestTimeToWear,
      top_notes: topNotes.map(n => n.trim()).filter(Boolean).slice(0, 5),
      middle_notes: middleNotes.map(n => n.trim()).filter(Boolean).slice(0, 5),
      base_notes: baseNotes.map(n => n.trim()).filter(Boolean).slice(0, 5),
      main_accords: mainAccords ? mainAccords.split(',').map(n => n.trim()).filter(Boolean) : [],
      longevity,
      sillage,
      gender,
      short_description: shortDescription,
      full_description: encyclopediaEntry,
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
        showSuccess('Perfume updated successfully.');
      } else {
        console.error('Failed to update perfume:', error);
        showError(`Failed to update perfume: ${error.message}`);
      }
    } else {
      const { data: newItems, error } = await supabase
        .from('perfumes')
        .insert([payload])
        .select();

      if (!error && newItems) {
        setData((prev) => [...newItems, ...prev]);
        setIsModalOpen(false);
        showSuccess('Perfume created successfully.');
      } else {
        console.error('Failed to add perfume:', error);
        showError(`Failed to add perfume: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const columns = [
    {
      header: 'Image',
      accessor: (item: any) => (
        <button
          type="button"
          onClick={() => item.image_url && setPreviewImageUrl(item.image_url)}
          className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-2xl flex items-center justify-center hover:border-[#C5A059]/40 transition-premium cursor-zoom-in"
        >
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Droplet className="w-5 h-5 text-white/20" />
          )}
        </button>
      )
    },
    { 
      header: 'Fragrance Overview', 
      accessor: (item: any) => (
        <div className="flex items-center gap-5 group/entry">
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

  const renderNotesGroup = (
    label: string,
    notes: string[],
    setNotes: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          onClick={() => notes.length < 5 && setNotes([...notes, ''])}
          className="h-9 px-3 rounded-xl text-[10px] font-brand font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Note
        </Button>
      </div>
      <div className="grid gap-3">
        {notes.map((note, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-3">
            <Input
              value={note}
              onChange={(event) => {
                const nextNotes = [...notes];
                nextNotes[index] = event.target.value;
                setNotes(nextNotes);
              }}
              placeholder={`Note ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                const nextNotes = notes.filter((_, noteIndex) => noteIndex !== index);
                setNotes(nextNotes.length ? nextNotes : ['']);
              }}
              className="shrink-0 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">Maximum of 5 notes for this group.</p>
    </div>
  );

  return (
    <div className="font-ui">
      <ResourceDataTable 
        title="PERFUME LIBRARY"
        description="Master index of the perfumes table with sample schema-aligned entries."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={(item) => setViewingItem(item)}
        onArchive={async (item) => {
          const { error } = await supabase.from('perfumes').update({ is_archived: true }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: true } : i));
            showSuccess('Perfume archived successfully.');
          } else {
            console.error('Failed to archive perfume:', error);
            showError(`Failed to archive perfume: ${error.message}`);
          }
        }}
        onUnarchive={async (item) => {
          const { error } = await supabase.from('perfumes').update({ is_archived: false }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: false } : i));
            showSuccess('Perfume restored successfully.');
          } else {
            console.error('Failed to restore perfume:', error);
            showError(`Failed to restore perfume: ${error.message}`);
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
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Niche">Niche</SelectItem>
                  <SelectItem value="Celebrity">Celebrity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="perfumer">Lead Creator (Nose)</Label>
              <Select
                value={perfumerId}
                onValueChange={(value) => {
                  setPerfumerId(value);
                  setPerfumerName(perfumersList.find((perfumer) => perfumer.id === value)?.name || '');
                }}
              >
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select perfumer" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  {perfumersList.map((perfumer) => (
                    <SelectItem key={perfumer.id} value={perfumer.id}>
                      {perfumer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
              <Label>Best Time to Wear</Label>
              <Select value={bestTimeToWear} onValueChange={setBestTimeToWear}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select best time" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Winter">Winter</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Autumn">Autumn</SelectItem>
                  <SelectItem value="Night Out">Night Out</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Sport">Sport</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-1 gap-10">
            {renderNotesGroup('Top Notes', topNotes, setTopNotes)}
            {renderNotesGroup('Middle Notes', middleNotes, setMiddleNotes)}
            {renderNotesGroup('Base Notes', baseNotes, setBaseNotes)}
          </div>

          <div className="grid grid-cols-3 gap-10">
            <div className="grid gap-3">
              <Label>Main Accords</Label>
              <Input value={mainAccords} onChange={(event) => setMainAccords(event.target.value)} placeholder="E.G. White Floral" />
            </div>
            <div className="grid gap-3">
              <Label>Longevity</Label>
              <Select value={longevity} onValueChange={setLongevity}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Longevity" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  <SelectItem value="Very Weak">Very Weak</SelectItem>
                  <SelectItem value="Weak">Weak</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Long Lasting">Long Lasting</SelectItem>
                  <SelectItem value="Eternal">Eternal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label>Sillage</Label>
              <Select value={sillage} onValueChange={setSillage}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Sillage" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  <SelectItem value="Intimate">Intimate</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Strong">Strong</SelectItem>
                  <SelectItem value="Enormous">Enormous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10">
            <div className="grid gap-3">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ImageUploadField label="Visual Documentation" value={imageUrl} onChange={setImageUrl} folder="perfumes" imageName={name || 'Perfume'} />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="desc">Short Description</Label>
            <Textarea id="desc" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder="Historical context and olfactory transition documentation..." className="h-44 rounded-[2rem] p-7 font-medium leading-relaxed resize-none" />
          </div>
          <div className="grid gap-3">
            <Label>Encyclopedia Entry (Full Description)</Label>
            <Textarea value={encyclopediaEntry} onChange={(event) => setEncyclopediaEntry(event.target.value)} placeholder="Full encyclopedic entry and tasting notes..." className="h-64 rounded-[2rem] p-7 font-medium leading-relaxed resize-none" />
          </div>
        </div>
      </ResourceModal>

      <ImagePreviewModal
        open={!!previewImageUrl}
        onClose={() => setPreviewImageUrl('')}
        src={previewImageUrl}
        alt={name || 'Perfume preview'}
      />

      <ResourceViewModal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        type="perfume"
        item={viewingItem}
      />
    </div>
  );
};

export default Perfumes;


