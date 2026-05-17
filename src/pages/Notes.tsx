import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import ImageUploadField from '@/components/admin/ImageUploadField';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { confirmAction, showError, showSuccess } from '@/lib/feedback';
import ResourceViewModal from '@/components/admin/ResourceViewModal';

const Notes: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [olfactoryCharacter, setOlfactoryCharacter] = useState('Floral');
  const [intensity, setIntensity] = useState('Moderate');
  const [season, setSeason] = useState('Daily');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [viewingItem, setViewingItem] = useState<any>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data: remoteData, error } = await supabase
        .from('perfume_notes')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Failed to load notes:', error.message);
      } else {
        setData(remoteData || []);
      }
    };

    fetchNotes();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setOlfactoryCharacter('Floral');
    setIntensity('Medium');
    setSeason('Daily');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name || '');
    setDescription(item.description || '');
    setImageUrl(item.image_url || '');
    setOlfactoryCharacter(item.olfactory_character || 'Floral');
    setIntensity(item.intensity || 'Medium');
    setSeason(item.season || 'Daily');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!await confirmAction(editingItem ? 'Save changes to this note?' : 'Create this note?')) {
      return;
    }

    const payload = {
      name,
      description,
      image_url: imageUrl,
      olfactory_character: olfactoryCharacter,
      intensity,
      season,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('perfume_notes')
        .update(payload)
        .eq('id', editingItem.id);

      if (!error) {
        setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...payload } : item));
        setIsModalOpen(false);
        showSuccess('Note updated successfully.');
      } else {
        console.error('Failed to update note:', error);
        showError(`Failed to update note: ${error.message}`);
      }
    } else {
      const { data: newItems, error } = await supabase
        .from('perfume_notes')
        .insert([{ ...payload, is_archived: false }])
        .select();

      if (!error && newItems) {
        setData((prev) => [...newItems, ...prev]);
        setIsModalOpen(false);
        showSuccess('Note created successfully.');
      } else {
        console.error('Failed to add note:', error);
        showError(`Failed to add note: ${error?.message || 'Unknown error'}`);
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
            <span className="text-sm font-serif font-black text-white/30">{item.name?.charAt(0)}</span>
          )}
        </button>
      )
    },
    {
      header: 'Olfactory Signature',
      accessor: (item: any) => (
        <div className="flex items-center gap-5 group/entry">
          <div className="flex flex-col">
            <span className="text-white font-brand font-black tracking-[0.1em] uppercase text-sm group-hover/entry:text-[#C5A059] transition-premium">{item.name}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">{item.olfactory_character}</span>
          </div>
        </div>
      )
    },
    { header: 'Intensity', accessor: (item: any) => <span className="text-[#C5A059] font-serif font-black text-[10px] uppercase tracking-widest">{item.intensity}</span> },
    { header: 'Season', accessor: (item: any) => <span className="text-white/60 font-medium uppercase text-[10px] tracking-[0.2em]">{item.season}</span> },
    {
      header: 'Status',
      accessor: (item: any) => (
        <span className="inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-brand font-black uppercase tracking-[0.2em] bg-white/5 border border-emerald-500/20 text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
          {item.is_archived ? 'Archived' : 'Active'}
        </span>
      )
    },
  ];

  return (
    <div className="font-ui text-white">
      <ResourceDataTable
        title="NOTE REPOSITORY"
        description="A specialized catalog of fundamental olfactory components and their chemical profiles."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={(item) => setViewingItem(item)}
        onArchive={async (item) => {
          const { error } = await supabase.from('perfume_notes').update({ is_archived: true }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: true } : i));
            showSuccess('Note archived successfully.');
          } else {
            console.error('Failed to archive note:', error);
            showError(`Failed to archive note: ${error.message}`);
          }
        }}
        onUnarchive={async (item) => {
          const { error } = await supabase.from('perfume_notes').update({ is_archived: false }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: false } : i));
            showSuccess('Note restored successfully.');
          } else {
            console.error('Failed to restore note:', error);
            showError(`Failed to restore note: ${error.message}`);
          }
        }}
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update Note' : 'New Note'}
        description="Technical documentation of olfactory resonance and molecular characteristics for the library archive."
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'Save Note' : 'Create Note'}
      >
        <div className="grid gap-12">
          <div className="grid gap-3">
            <Label>Signature Identifier</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="E.G. CALONE" />
          </div>
          <div className="grid gap-3">
            <Label>Olfactory Character</Label>
            <Select value={olfactoryCharacter} onValueChange={setOlfactoryCharacter}>
              <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                <SelectValue placeholder="Select Scent Profile" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                <SelectItem value="Fresh">Fresh</SelectItem>
                <SelectItem value="Sweet">Sweet</SelectItem>
                <SelectItem value="Woody">Woody</SelectItem>
                <SelectItem value="Floral">Floral</SelectItem>
                <SelectItem value="Spicy">Spicy</SelectItem>
                <SelectItem value="Oriental">Oriental</SelectItem>
                <SelectItem value="Leathery">Leathery</SelectItem>
                <SelectItem value="Gourmand">Gourmand</SelectItem>
                <SelectItem value="Synthetic">Synthetic</SelectItem>
                <SelectItem value="Aquatic">Aquatic</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="Citrus">Citrus</SelectItem>
                <SelectItem value="Animalic">Animalic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
              <Label>Intensity</Label>
              <Select value={intensity} onValueChange={setIntensity}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Intensity" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                    <SelectItem value="Soft">Soft</SelectItem>
                    <SelectItem value="Subtle">Subtle</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Strong">Strong</SelectItem>
                    <SelectItem value="Overpowering">Overpowering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label>Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Autumn">Autumn</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                    <SelectItem value="Night Out">Night Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Note Description</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="h-44 resize-none" placeholder="Describe the scent, source, and usage profile..." />
          </div>
          <ImageUploadField label="Note Image" value={imageUrl} onChange={setImageUrl} folder="notes" imageName={name || 'Note'} />
        </div>
      </ResourceModal>

      <ImagePreviewModal
        open={!!previewImageUrl}
        onClose={() => setPreviewImageUrl('')}
        src={previewImageUrl}
        alt={name || 'Note preview'}
      />

      <ResourceViewModal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        type="note"
        item={viewingItem}
      />
    </div>
  );
};

export default Notes;


