import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import ImageUploadField from '@/components/admin/ImageUploadField';
import ImagePreviewModal from '@/components/admin/ImagePreviewModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import TruncatedText from '@/components/ui/truncated-text';
import { confirmAction, showError, showSuccess } from '@/lib/feedback';

const Journals: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  useEffect(() => {
    const fetchJournals = async () => {
      const { data: remoteData, error } = await supabase
        .from('user_journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load journals:', error.message);
      } else {
        setData(remoteData || []);
      }
    };

    fetchJournals();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setContent(item.content || '');
    setImageUrl(item.image_url || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!await confirmAction(editingItem ? 'Save changes to this journal entry?' : 'Create this journal entry?')) {
      return;
    }

    const payload = {
      title,
      content,
      image_url: imageUrl,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('user_journal_entries')
        .update(payload)
        .eq('id', editingItem.id);

      if (!error) {
        setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...payload } : item));
        setIsModalOpen(false);
        showSuccess('Journal entry updated successfully.');
      } else {
        console.error('Failed to update journal entry:', error);
        showError(`Failed to update journal entry: ${error.message}`);
      }
    } else {
      const { data: newItems, error } = await supabase
        .from('user_journal_entries')
        .insert([{ ...payload, is_archived: false }])
        .select();

      if (!error && newItems) {
        setData((prev) => [...newItems, ...prev]);
        setIsModalOpen(false);
        showSuccess('Journal entry created successfully.');
      } else {
        console.error('Failed to add journal entry:', error);
        showError(`Failed to add journal entry: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const columns = [
    {
      header: 'Photo',
      accessor: (item: any) => (
        <button
          type="button"
          onClick={() => item.image_url && setPreviewImageUrl(item.image_url)}
          className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-2xl flex items-center justify-center hover:border-[#C5A059]/40 transition-premium cursor-zoom-in"
        >
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-serif font-black text-white/30">J</span>
          )}
        </button>
      )
    },
    { 
      header: 'Journal Entry', 
      accessor: (item: any) => (
        <div className="flex flex-col group/entry">
          <span className="text-white font-brand font-black hover:text-[#C5A059] cursor-pointer transition-premium leading-tight uppercase tracking-widest text-sm">
            {item.title}
          </span>
          <span className="text-[10px] text-white/30 font-serif font-bold uppercase tracking-[0.2em] mt-2 border-b border-white/5 pb-1 w-fit">CREATED: {new Date(item.created_at).toLocaleDateString()}</span>
        </div>
      )
    },
    { header: 'Excerpt', accessor: (item: any) => <TruncatedText text={item.content} maxLength={60} className="text-white/40 font-brand font-black text-[9px] uppercase tracking-[0.2em]" /> },
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
    <div className="font-ui text-white">
      <ResourceDataTable 
        title="JOURNAL ARCHIVES"
        description="A specialized collection of scholarly deep-dives and technical olfactory reviews."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArchive={async (item) => {
          const { error } = await supabase.from('user_journal_entries').update({ is_archived: true }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: true } : i));
            showSuccess('Journal entry archived successfully.');
          } else {
            console.error('Failed to archive journal entry:', error);
            showError(`Failed to archive journal entry: ${error.message}`);
          }
        }}
        onUnarchive={async (item) => {
          const { error } = await supabase.from('user_journal_entries').update({ is_archived: false }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: false } : i));
            showSuccess('Journal entry restored successfully.');
          } else {
            console.error('Failed to restore journal entry:', error);
            showError(`Failed to restore journal entry: ${error.message}`);
          }
        }}
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update Journal Entry' : 'New Journal Entry'}
        description="Compose technical editorial content for the AURE SCENTS scholar community archive."
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'Save Entry' : 'Create Entry'}
      >
        <div className="grid gap-12">
          <div className="grid gap-3">
            <Label>Title</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="E.G. THE ART OF DISTILLATION" />
          </div>
          <ImageUploadField label="Add Photo" value={imageUrl} onChange={setImageUrl} folder="journal-entries" imageName={title || 'Journal Entry'} />
          <div className="grid gap-3">
            <Label>Impression</Label>
            <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Begin documenting the olfactory narrative with scholarly precision..." className="h-64 rounded-[2rem] p-8 leading-relaxed resize-none transition-premium focus:border-[#C5A059]/30" />
          </div>
        </div>
      </ResourceModal>

      <ImagePreviewModal
        open={!!previewImageUrl}
        onClose={() => setPreviewImageUrl('')}
        src={previewImageUrl}
        alt={title || 'Journal preview'}
      />
    </div>
  );
};

export default Journals;


