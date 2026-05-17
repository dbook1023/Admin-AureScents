import React, { useEffect, useState } from 'react';
import { UserCircle, Mail, Droplet, Compass, Hash, Sparkles } from 'lucide-react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/lib/feedback';

interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  signature_scent: string | null;
  preferred_occasion: string | null;
  preferred_accords: string | null;
  updated_at: string;
}

const Users: React.FC = () => {
  const [data, setData] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserProfile | null>(null);

  const parseList = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field.filter(Boolean);
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        return field.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: remoteData, error } = await supabase
        .from('profiles')
        .select('id,email,display_name,avatar_url,signature_scent,preferred_occasion,preferred_accords,updated_at')
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
      header: 'Photo',
      accessor: (item: UserProfile) => (
        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-2xl">
          {item.avatar_url ? (
            <img src={item.avatar_url} alt={item.display_name || 'User avatar'} className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-6 h-6 text-white/20" />
          )}
        </div>
      ),
    },
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

  const handleEdit = (item: UserProfile) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleArchive = async (item: UserProfile) => {
    const { error } = await supabase.from('profiles').update({ is_archived: true }).eq('id', item.id);
    if (!error) {
      setData((prev) => prev.map((profile) => profile.id === item.id ? { ...profile, is_archived: true } : profile));
      showSuccess('User profile archived successfully.');
    } else {
      console.error('Failed to archive user profile:', error);
      showError(`Failed to archive user profile: ${error.message}`);
    }
  };

  const handleUnarchive = async (item: UserProfile) => {
    const { error } = await supabase.from('profiles').update({ is_archived: false }).eq('id', item.id);
    if (!error) {
      setData((prev) => prev.map((profile) => profile.id === item.id ? { ...profile, is_archived: false } : profile));
      showSuccess('User profile restored successfully.');
    } else {
      console.error('Failed to restore user profile:', error);
      showError(`Failed to restore user profile: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-ui text-white">
      <ResourceDataTable
        title="USER ACCOUNTS"
        description="Display users who have active accounts through the profiles table."
        data={data}
        columns={columns}
        onEdit={handleEdit}
        editLabel="View User"
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        searchPlaceholder="Search accounts by name, email, or scent preference..."
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="View User"
        description="Read-only profile details for this user account."
        onSubmit={handleSubmit}
        submitLabel="Close"
      >
        <div className="grid gap-10">
          <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-gradient-to-r from-white/[0.05] to-transparent border border-white/5 shadow-xl">
            <div className="w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden border border-white/10 bg-[#0A192F]/60 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative group">
              <div className="absolute inset-0 bg-[#C5A059]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {editingItem?.avatar_url ? (
                <img src={editingItem.avatar_url} alt={editingItem.display_name || 'User avatar'} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-10 h-10 text-white/20" />
              )}
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="text-[10px] font-brand font-black uppercase tracking-[0.3em] text-[#C5A059]">Registered Member</p>
              <p className="text-2xl text-white font-brand font-black uppercase tracking-widest truncate">{editingItem?.display_name || 'Anonymous User'}</p>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mt-1 font-medium truncate">ID: {editingItem?.id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-2 shadow-lg hover:border-white/10 transition-colors">
              <span className="text-[9px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" /> Account Email
              </span>
              <span className="text-[11px] font-medium text-white tracking-wide truncate" title={editingItem?.email || ''}>{editingItem?.email || 'N/A'}</span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-2 shadow-lg hover:border-white/10 transition-colors">
              <span className="text-[9px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#C5A059]" /> Internal UID
              </span>
              <span className="text-[10px] font-medium text-white/60 tracking-wider truncate" title={editingItem?.id}>{editingItem?.id || 'N/A'}</span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-2 sm:col-span-2 shadow-lg hover:border-[#C5A059]/20 transition-colors">
              <span className="text-[9px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-[#C5A059]" /> Signature Scent
              </span>
              <span className="text-[13px] font-brand font-black text-white uppercase tracking-widest">{editingItem?.signature_scent || 'Not Defined'}</span>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 shadow-lg hover:border-white/10 transition-colors sm:col-span-2">
              <span className="text-[9px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" /> Preferred Accords
              </span>
              <div className="flex flex-wrap gap-2">
                {parseList(editingItem?.preferred_accords).length > 0 ? (
                  parseList(editingItem?.preferred_accords).map((accord, idx) => (
                    <span 
                      key={idx} 
                      className="bg-white/[0.03] border border-white/10 text-white font-brand font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-xl shadow-sm"
                    >
                      {accord}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] font-medium text-white/40 tracking-wide italic">Not Defined</span>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-2 shadow-lg hover:border-white/10 transition-colors sm:col-span-2">
              <span className="text-[9px] font-brand font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Ideal Occasion
              </span>
              <div className="flex flex-wrap gap-2">
                {parseList(editingItem?.preferred_occasion).length > 0 ? (
                  parseList(editingItem?.preferred_occasion).map((occ, idx) => (
                    <span 
                      key={idx} 
                      className="bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#E0CA78] font-brand font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-xl shadow-sm"
                    >
                      {occ}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] font-medium text-white/40 tracking-wide italic">Not Defined</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default Users;

