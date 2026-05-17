import React, { useEffect, useState } from 'react';
import ResourceDataTable from '@/components/admin/ResourceDataTable';
import ResourceModal from '@/components/admin/ResourceModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { confirmAction, showError, showSuccess } from '@/lib/feedback';

interface AdminUser {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
  status?: string;
}

const AdminUsers: React.FC = () => {
  const [data, setData] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('admin');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data: remoteData, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load admin users:', error.message);
      } else if (remoteData) {
        setData(remoteData as AdminUser[]);
      }
    };

    fetchAdmins();
  }, []);

  const columns = [
    {
      header: 'Administrator',
      accessor: (item: AdminUser) => (
        <div className="flex flex-col">
          <span className="text-white font-brand font-black tracking-[0.1em] uppercase text-sm">{item.display_name || 'No Name'}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">{item.email}</span>
        </div>
      ),
    },
    { header: 'Role', accessor: (item: AdminUser) => <span className="text-[#C5A059] font-bold uppercase text-[10px] tracking-[0.25em]">{item.role}</span> },
    { header: 'Created at', accessor: (item: AdminUser) => <span className="text-white/60 text-[10px] uppercase tracking-[0.2em]">{new Date(item.created_at).toLocaleDateString()}</span> },
    {
      header: 'Status',
      accessor: () => (
        <span className="inline-flex items-center rounded-xl px-4 py-1.5 text-[10px] font-brand font-black uppercase tracking-[0.2em] bg-white/5 border border-emerald-500/20 text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
          Active
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setEmail('');
    setDisplayName('');
    setRole('admin');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: AdminUser) => {
    setEditingItem(item);
    setEmail(item.email);
    setDisplayName(item.display_name || '');
    setRole(item.role);
    setPassword('');
    setIsModalOpen(true);
  };

  const handleArchive = async (item: AdminUser) => {
    const { error } = await supabase.from('admin_users').delete().eq('id', item.id);
    if (!error) {
      setData((prev) => prev.filter((admin) => admin.id !== item.id));
      showSuccess('Admin user archived successfully.');
    } else {
      console.error('Failed to archive admin user:', error);
      showError(`Failed to archive admin user: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!await confirmAction(editingItem ? 'Save changes to this admin user?' : 'Create this admin user?')) {
      return;
    }

    if (!email) {
      showError('Email is required.');
      return;
    }

    if (editingItem) {
      const updatePayload: any = { email, display_name: displayName, role };
      if (password) updatePayload.password = password;
      const { error } = await supabase
        .from('admin_users')
        .update(updatePayload)
        .eq('id', editingItem.id);

      if (error) {
        console.error('Failed to update admin user:', error.message);
        showError(`Failed to update admin user: ${error.message}`);
      } else {
        setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, email, display_name: displayName, role } : item));
        showSuccess('Admin user updated successfully.');
      }
    } else {
      const { data: inserted, error } = await supabase
        .from('admin_users')
        .insert([{ email, display_name: displayName, role, password }])
        .select();

      if (error) {
        console.error('Failed to create admin user:', error.message);
        showError(`Failed to create admin user: ${error.message}`);
      } else if (inserted?.length) {
        setData((prev) => [inserted[0] as AdminUser, ...prev]);
        showSuccess('Admin user created successfully.');
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="font-ui text-white">
      <ResourceDataTable
        title="ADMINISTRATORS"
        description="Manage the separate admin users table for system-level access."
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        searchPlaceholder="Search admins by email or name..."
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update Admin User' : 'New Admin User'}
        description="Create or update an administrator record separate from regular users."
        onSubmit={handleSubmit}
        submitLabel={editingItem ? 'Save Changes' : 'Create Admin'}
      >
        <div className="grid gap-12">
          <div className="grid gap-3">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="admin-name">Display Name</Label>
            <Input id="admin-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="admin-role">Role</Label>
            <Input id="admin-role" value={role} onChange={(event) => setRole(event.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="admin-password">{editingItem ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
            <Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={editingItem ? '••••••••' : 'Enter password'} />
          </div>
        </div>
      </ResourceModal>
    </div>
  );
};

export default AdminUsers;


