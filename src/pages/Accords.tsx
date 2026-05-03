import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const Accords: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('CLASSICAL');
  const [status, setStatus] = useState('Curated');

  useEffect(() => {
    // The 'perfume_accords' table does not exist in the database schema.
    // Initializing with an empty array to prevent fetching errors.
    setData([]);
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setName('');
    setNotes('');
    setType('CLASSICAL');
    setStatus('Curated');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name || '');
    setNotes(item.notes || '');
    setType(item.type || 'CLASSICAL');
    setStatus(item.status || 'Curated');
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, name, notes, type, status } : item));
    } else {
      setData((prev) => [
        { id: Date.now().toString(), name, notes, type, status },
        ...prev,
      ]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { 
      header: 'Olfactory Accord', 
      accessor: (item: any) => (
        <span className="text-white font-serif font-black tracking-[0.15em] uppercase text-sm border-b border-white/5 pb-1">{item.name} ACCORD</span>
      )
    },
    { header: 'Profile Type', accessor: (item: any) => <span className="text-white/40 font-brand font-black text-[9px] uppercase tracking-[0.2em]">{item.type}</span> },
    { 
      header: 'Key Structural Components', 
      accessor: (item: any) => (
        <div className="flex flex-wrap gap-2">
          {item.notes?.split(',').map((note: string, i: number) => (
            <span key={i} className="text-[10px] text-white/50 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-xl font-brand font-black uppercase tracking-widest transition-premium hover:border-[#C5A059]/30">
              {note.trim()}
            </span>
          ))}
        </div>
      )
    },
    { 
      header: 'Curation', 
      accessor: (item: any) => (
        <span className="inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-brand font-black uppercase tracking-[0.2em] bg-white/5 border border-emerald-500/20 text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
          {item.status}
        </span>
      ) 
    },
  ];

  return (
    <div className="font-ui text-white">
      <ResourceDataTable 
        title="ACCORD REPOSITORY"
        description="Comprehensive documentation of harmonic olfactory chords and their structural components."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArchive={(item) => setData(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Archived' } : i))}
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update Accord' : 'New Accord'}
        description="Define the harmonic resonance and note composition for the accord library archive."
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'Save Accord' : 'Create Accord'}
      >
        <div className="grid gap-12">
          <div className="grid gap-3">
            <Label>Nomenclature Identification</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="E.G. SOLARE" />
          </div>
          <div className="grid gap-3">
            <Label>Profile Type</Label>
            <Input value={type} onChange={(event) => setType(event.target.value)} placeholder="CLASSICAL" />
          </div>
          <div className="grid gap-3">
            <Label>Key Notes</Label>
            <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="E.G. Oakmoss, Patchouli, Bergamot" />
          </div>
          <div className="grid gap-3">
            <Label>Curation Status</Label>
            <Input value={status} onChange={(event) => setStatus(event.target.value)} placeholder="Curated" />
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default Accords;
