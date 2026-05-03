import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import TruncatedText from '@/components/ui/truncated-text';

const Brands: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [history, setHistory] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      const { data: remoteData, error } = await supabase
        .from('perfume_brands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load brands:', error.message);
      } else {
        setData(remoteData || []);
      }
    };

    fetchBrands();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setName('');
    setCountry('');
    setWebsiteUrl('');
    setLogoUrl('');
    setHistory('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name || '');
    setCountry(item.country || '');
    setWebsiteUrl(item.website_url || '');
    setLogoUrl(item.logo_url || '');
    setHistory(item.history || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      country,
      website_url: websiteUrl,
      logo_url: logoUrl,
      history,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('perfume_brands')
        .update(payload)
        .eq('id', editingItem.id);

      if (!error) {
        setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...payload } : item));
        setIsModalOpen(false);
      } else {
        console.error('Failed to update brand:', error);
      }
    } else {
      const brandId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { data: newItems, error } = await supabase
        .from('perfume_brands')
        .insert([{ id: brandId, ...payload, is_archived: false }])
        .select();

      if (!error && newItems) {
        setData((prev) => [...newItems, ...prev]);
        setIsModalOpen(false);
      } else {
        console.error('Failed to add brand:', error);
      }
    }
  };

  const columns = [
    { 
      header: 'Fragrance House Identification', 
      accessor: (item: any) => (
        <div className="flex items-center gap-5 group/entry">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl font-serif font-black text-white/30 uppercase text-xs tracking-tighter transition-premium group-hover/entry:border-[#C5A059]/40 group-hover/entry:text-white">
             {item.name?.slice(0, 3)}
          </div>
          <span className="text-white font-brand font-black tracking-[0.2em] uppercase text-sm group-hover/entry:text-[#C5A059] transition-premium">{item.name}</span>
        </div>
      )
    },
    { header: 'Geographic Origins', accessor: (item: any) => <span className="text-white/20 font-bold uppercase text-[9px] tracking-[0.3em] ml-1">{item.country}</span> },
    { header: 'Website', accessor: (item: any) => <a href={item.website_url} target="_blank" rel="noreferrer" className="text-[#C5A059] hover:text-[#E0CA78] text-[10px] uppercase tracking-[0.3em]">{item.website_url}</a> },
    { header: 'Historic Summary', accessor: (item: any) => <TruncatedText text={item.history} maxLength={50} className="text-white/40 font-brand font-black text-[9px] uppercase tracking-[0.2em] italic" /> },
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
        title="BRAND REPOSITORY"
        description="A specialized directory of historical fragrance houses and modern boutique institutions."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArchive={async (item) => {
          const { error } = await supabase.from('perfume_brands').update({ is_archived: true }).eq('id', item.id);
          if (!error) {
            setData(prev => prev.map(i => i.id === item.id ? { ...i, is_archived: true } : i));
          } else {
            console.error('Failed to archive brand:', error);
          }
        }}
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update Brand' : 'New Brand'}
        description="Refining the historical and institutional identifiers within the global library archive."
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'Save Brand' : 'Create Brand'}
      >
        <div className="grid gap-12">
          <div className="grid gap-4">
            <Label>Official Repository Name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="E.G. CREED" />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="grid gap-3">
               <Label>Geographic Origin</Label>
               <Input value={country} onChange={(event) => setCountry(event.target.value)} />
            </div>
            <div className="grid gap-3">
               <Label>Website URL</Label>
               <Input value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} placeholder="https://" />
            </div>
          </div>
          <div className="grid gap-3">
             <Label>Logo Identifier (Image URL)</Label>
             <Input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="https://" />
          </div>
          <div className="grid gap-3">
            <Label>Institutional History</Label>
            <Textarea value={history} onChange={(event) => setHistory(event.target.value)} className="h-48 resize-none" placeholder="Document the historical heritage and olfactory evolution..." />
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default Brands;
