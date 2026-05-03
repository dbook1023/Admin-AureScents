import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import TruncatedText from '@/components/ui/truncated-text';

const Perfumers: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchPerfumers = async () => {
      const { data: remoteData, error } = await supabase
        .from('perfumers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Failed to load perfumers:', error.message);
      } else {
        setData(remoteData || []);
      }
    };

    fetchPerfumers();
  }, []);

  const columns = [
    { 
      header: 'Master Nose', 
      accessor: (item: any) => (
        <div className="flex items-center gap-5 group/entry">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/30 font-serif font-black shadow-2xl group-hover/entry:scale-110 group-hover/entry:border-[#C5A059]/40 transition-premium uppercase text-lg">
            {item.name.charAt(0)}
          </div>
          <span className="text-white font-brand font-black tracking-[0.15em] uppercase text-sm group-hover/entry:text-[#C5A059] transition-premium">{item.name}</span>
        </div>
      )
    },
    { header: 'Professional Biography', accessor: (item: any) => <TruncatedText text={item.bio} maxLength={60} className="text-white/40 font-brand font-black text-[9px] uppercase tracking-[0.2em]" /> },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <span className={`inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-brand font-black uppercase tracking-[0.2em] shadow-sm bg-white/5 border border-emerald-500/20 text-emerald-400`}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
          {item.is_archived ? 'Archived' : 'Active'}
        </span>
      ) 
    },
  ];

  return (
    <div className="font-ui">
      <ResourceDataTable 
        title="PERFUMERS HALL"
        description="Profiles of the visionaries responsible for the library's most remarkable assets."
        data={data}
        columns={columns}
        onAdd={() => { setEditingItem(null); setName(''); setBio(''); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setName(item.name || ''); setBio(item.bio || ''); setIsModalOpen(true); }}
        onArchive={async (item) => {
          const { error } = await supabase.from('perfumers').update({ is_archived: true }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: true } : i));
          } else {
            console.error('Failed to archive perfumer:', error);
          }
        }}
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Update Profile" : "Hall Induction"}
        description="Comprehensive professional and biographical documentation for the library archive."
        onSubmit={async () => {
          const payload = { name, bio };

          if (editingItem) {
            const { error } = await supabase.from('perfumers').update(payload).eq('id', editingItem.id);
            if (!error) {
              setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...payload } : item));
              setIsModalOpen(false);
            } else {
              console.error('Failed to update perfumer:', error);
            }
          } else {
            const { data: newItems, error } = await supabase.from('perfumers').insert([{ ...payload, is_archived: false }]).select();
            if (!error && newItems) {
              setData((prev) => [...newItems, ...prev]);
              setIsModalOpen(false);
            } else {
              console.error('Failed to add perfumer:', error);
            }
          }
        }}
      >
        <div className="grid gap-10">
          <div className="grid gap-3">
            <Label htmlFor="perfumer-name">Master Name</Label>
            <Input id="perfumer-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="bio">Administrative Biography</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Chronological documentation of career milestones and olfactory transition..." className="h-48 resize-none" />
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default Perfumers;
