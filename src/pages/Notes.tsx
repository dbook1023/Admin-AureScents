import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

const Notes: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [olfactoryCharacter, setOlfactoryCharacter] = useState('Floral');
  const [intensity, setIntensity] = useState('Moderate');
  const [season, setSeason] = useState('All Seasons');

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

  const uniqueOlfactoryCharacters = Array.from(new Set(data.map(n => n.olfactory_character).filter(Boolean)));

  const handleAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setOlfactoryCharacter('Floral');
    setIntensity('Moderate');
    setSeason('All Seasons');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name || '');
    setDescription(item.description || '');
    setImageUrl(item.image_url || '');
    setOlfactoryCharacter(item.olfactory_character || 'Floral');
    setIntensity(item.intensity || 'Moderate');
    setSeason(item.season || 'All Seasons');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
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
        alert('Note updated successfully!');
      } else {
        console.error('Failed to update note:', error);
        alert('Failed to update note: ' + error.message);
      }
    } else {
      const { data: newItems, error } = await supabase
        .from('perfume_notes')
        .insert([{ ...payload, is_archived: false }])
        .select();

      if (!error && newItems) {
        setData((prev) => [...newItems, ...prev]);
        setIsModalOpen(false);
        alert('Note created successfully!');
      } else {
        console.error('Failed to add note:', error);
        alert('Failed to add note: ' + error.message);
      }
    }
  };

  const columns = [
    {
      header: 'Olfactory Signature',
      accessor: (item: any) => (
        <div className="flex items-center gap-5 group/entry">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-2xl transition-premium group-hover/entry:border-[#C5A059]/40">
            <span className="text-sm font-serif font-black text-white/30 group-hover/entry:text-[#C5A059]">{item.name?.charAt(0)}</span>
          </div>
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
        onArchive={async (item) => {
          const { error } = await supabase.from('perfume_notes').update({ is_archived: true }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: true } : i));
          } else {
            console.error('Failed to archive note:', error);
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
            <Input list="character-list" value={olfactoryCharacter} onChange={(event) => setOlfactoryCharacter(event.target.value)} placeholder="Select or type..." />
            <datalist id="character-list">
              {uniqueOlfactoryCharacters.map((c, i) => <option key={i} value={c as string} />)}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
              <Label>Intensity</Label>
              <Select value={intensity} onValueChange={setIntensity}>
                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold tracking-widest uppercase text-[10px]">
                  <SelectValue placeholder="Select Intensity" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 rounded-2xl text-white">
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Strong">Strong</SelectItem>
                  <SelectItem value="Intense">Intense</SelectItem>
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
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Autumn">Autumn</SelectItem>
                  <SelectItem value="Winter">Winter</SelectItem>
                  <SelectItem value="All Seasons">All Seasons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Note Description</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="h-44 resize-none" placeholder="Describe the scent, source, and usage profile..." />
          </div>
          <div className="grid gap-3">
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://" />
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default Notes;
