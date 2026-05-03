import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  signature_scent: string | null;
  preferred_occasion: string | null;
  preferred_accords: string | null;
  updated_at: string;
}

const Users: React.FC = () => {
  const [data, setData] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [signatureScent, setSignatureScent] = useState('');
  const [preferredOccasion, setPreferredOccasion] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: remoteData, error } = await supabase
        .from('profiles')
        .select('id,email,display_name,signature_scent,preferred_occasion,preferred_accords,updated_at')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Failed to load users:', error.message);
      } else {
        setData(remoteData as UserProfile[] || []);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      header: 'User',
      accessor: (item: UserProfile) => (
        <div className="flex flex-col">
          <span className="text-white font-brand font-black tracking-[0.1em] uppercase text-sm">{item.display_name || 'Anonymous User'}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">{item.email}</span>
        </div>
      ),
    },
    { header: 'Signature Scent', accessor: (item: UserProfile) => <span className="text-white/40 font-brand font-black text-[10px] uppercase tracking-[0.2em]">{item.signature_scent || 'N/A'}</span> },
    { header: 'Preferred Occasion', accessor: (item: UserProfile) => <span className="text-[#C5A059] font-bold uppercase text-[10px] tracking-[0.25em]">{item.preferred_occasion || 'General'}</span> },
    {
      header: 'Status',
      accessor: () => (
        <span className="inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-brand font-black uppercase tracking-[0.2em] bg-white/5 border border-emerald-500/20 text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
          Account Active
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setEmail('');
    setDisplayName('');
    setSignatureScent('');
    setPreferredOccasion('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: UserProfile) => {
    setEditingItem(item);
    setEmail(item.email || '');
    setDisplayName(item.display_name || '');
    setSignatureScent(item.signature_scent || '');
    setPreferredOccasion(item.preferred_occasion || '');
    setIsModalOpen(true);
  };

  const handleArchive = async (item: UserProfile) => {
    const { error } = await supabase.from('profiles').delete().eq('id', item.id);
    if (!error) {
      setData((prev) => prev.filter((profile) => profile.id !== item.id));
    } else {
      console.error('Failed to archive user profile:', error);
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      return;
    }

    if (editingItem) {
      const { error } = await supabase
        .from('profiles')
        .update({ email, display_name: displayName, signature_scent: signatureScent, preferred_occasion: preferredOccasion })
        .eq('id', editingItem.id);

      if (error) {
        console.error('Failed to update user profile:', error.message);
      } else {
        setData((prev) => prev.map((item) => item.id === editingItem.id ? {
          ...item,
          email,
          display_name: displayName,
          signature_scent: signatureScent,
          preferred_occasion: preferredOccasion,
        } : item));
      }
    } else {
      const { data: inserted, error } = await supabase
        .from('profiles')
        .insert([{ email, display_name: displayName, signature_scent: signatureScent, preferred_occasion: preferredOccasion }])
        .select();

      if (error) {
        console.error('Failed to create user profile:', error.message);
      } else if (inserted?.length) {
        setData((prev) => [inserted[0] as UserProfile, ...prev]);
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="font-ui text-white">
      <ResourceDataTable
        title="USER ACCOUNTS"
        description="Display users who have active accounts through the profiles table."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArchive={handleArchive}
        searchPlaceholder="Search accounts by name, email, or scent preference..."
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update User Account' : 'New User Account'}
        description="Manage account profile details for users with registered accounts."
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'Save Profile' : 'Create Profile'}
      >
        <div className="grid gap-12">
          <div className="grid gap-3">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="user-name">Display Name</Label>
            <Input id="user-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="user-scent">Signature Scent</Label>
            <Input id="user-scent" value={signatureScent} onChange={(event) => setSignatureScent(event.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="user-occasion">Preferred Occasion</Label>
            <Input id="user-occasion" value={preferredOccasion} onChange={(event) => setPreferredOccasion(event.target.value)} />
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default Users;
