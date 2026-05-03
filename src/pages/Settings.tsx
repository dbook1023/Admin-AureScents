import React, { useEffect, useState } from 'react';
import { 
  Save,
  Camera,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from '@/lib/supabase';

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const userJson = localStorage.getItem('adminUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      setAdminData(user);
      setDisplayName(user.display_name || '');
      setEmail(user.email || '');
      // Fetch full bio from Supabase as it might not be in localStorage
      const fetchFullData = async () => {
        const { data, error } = await supabase
          .from('admin_users')
          .select('bio')
          .eq('id', user.id)
          .single();
        if (data) setBio(data.bio || '');
      };
      fetchFullData();
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!adminData) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          display_name: displayName,
          email: email,
          bio: bio
        })
        .eq('id', adminData.id);

      if (error) throw error;

      // Update localStorage
      const updatedUser = { ...adminData, display_name: displayName, email: email };
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      setAdminData(updatedUser);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!adminData || !newPassword) return;
    setIsLoading(true);
    try {
      // First verify current password
      const { data, error: fetchError } = await supabase
        .from('admin_users')
        .select('password')
        .eq('id', adminData.id)
        .single();

      if (fetchError) throw fetchError;
      if (data.password !== currentPassword) {
        alert('Current password incorrect.');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('admin_users')
        .update({ password: newPassword })
        .eq('id', adminData.id);

      if (error) throw error;
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      alert('Error updating password: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-10 pb-10 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-brand font-black text-white tracking-tight uppercase">Settings</h1>
          <p className="text-white/40 mt-1 font-medium text-sm tracking-wide">Manage administrative identity and system security protocols.</p>
        </div>
        <Button 
          onClick={handleSaveProfile} 
          disabled={isLoading}
          className="glass-button-active h-12 px-8 rounded-xl font-brand font-black text-[10px] uppercase tracking-widest shadow-2xl transition-premium disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-10">
        <TabsList className="bg-white/[0.03] p-1.5 rounded-2xl h-14 border border-white/5 backdrop-blur-md">
          <TabsTrigger value="profile" className="rounded-xl px-8 h-11 data-[state=active]:glass-button-active data-[state=active]:text-[#0A192F] data-[state=active]:shadow-lg font-brand font-black text-[10px] uppercase tracking-widest transition-premium text-white/30 hover:text-white">
             Identity
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 h-11 data-[state=active]:glass-button-active data-[state=active]:text-[#0A192F] data-[state=active]:shadow-lg font-brand font-black text-[10px] uppercase tracking-widest transition-premium text-white/30 hover:text-white">
             Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-8 h-11 data-[state=active]:glass-button-active data-[state=active]:text-[#0A192F] data-[state=active]:shadow-lg font-brand font-black text-[10px] uppercase tracking-widest transition-premium text-white/30 hover:text-white">
             Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-10 animate-in fade-in-50 duration-700">
          <Card className="glass-card rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-white text-2xl font-brand font-black uppercase tracking-tight">Admin Profile</CardTitle>
              <CardDescription className="text-white/30 text-xs mt-2 tracking-wide">Update your executive identifiers and bibliography.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
              <div className="flex items-center gap-10 pb-10 border-b border-white/5">
                 <div className="relative group">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/[0.03] flex items-center justify-center text-white text-2xl font-brand font-black border border-white/10 shadow-2xl transition-premium group-hover:scale-105 group-hover:bg-white/10">
                       {initials || 'AD'}
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-[#C5A059] text-[#0A192F] p-3 rounded-2xl shadow-2xl border-2 border-[#0A192F] hover:scale-110 transition-premium">
                       <Camera className="w-4 h-4" />
                    </button>
                 </div>
                 <div>
                    <h4 className="text-xl font-brand font-black text-white uppercase tracking-tight">{displayName || 'Admin Principal'}</h4>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mt-2">{adminData?.role || 'Primary Library Controller'}</p>
                    <div className="flex gap-3 mt-5">
                       <Button size="sm" variant="ghost" className="glass-button-ghost h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Change Photo</Button>
                       <Button size="sm" variant="ghost" className="h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 hover:text-red-400">Remove</Button>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                    <Label className="text-[10px] font-brand font-black uppercase tracking-[0.3em] text-white/20 ml-1">Designation</Label>
                    <Input 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-white/[0.03] border-white/5 text-white h-14 rounded-2xl text-sm font-medium focus-visible:ring-[#C5A059]/30 transition-premium placeholder:text-white/10" 
                    />
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] font-brand font-black uppercase tracking-[0.3em] text-white/20 ml-1">Official Email</Label>
                    <Input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/[0.03] border-white/5 text-white h-14 rounded-2xl text-sm font-medium focus-visible:ring-[#C5A059]/30 transition-premium placeholder:text-white/10" 
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <Label className="text-[10px] font-brand font-black uppercase tracking-[0.3em] text-white/20 ml-1">Bibliographic Bio</Label>
                 <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 text-white rounded-[2rem] p-7 min-h-[180px] text-sm font-medium focus:ring-1 focus:ring-[#C5A059]/30 outline-none transition-premium resize-none" 
                  placeholder="Chief Curator of the Aure Scents Institutional Archive. Overseeing the preservation of olfactory legacies and scent methodologies." 
                 />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-10 animate-in fade-in-50 duration-700">
           <Card className="glass-card rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
               <CardTitle className="text-white text-2xl font-brand font-black uppercase tracking-tight">Security Protocol</CardTitle>
               <CardDescription className="text-white/30 text-xs mt-2 tracking-wide">Manage passwords and authentication keys.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
               <div className="flex items-center justify-between p-8 bg-white/5/[0.02] rounded-[2rem] border border-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-6">
                     <div className="p-4 bg-[#C5A059]/10 rounded-2xl border border-[#C5A059]/20">
                        <ShieldCheck className="w-7 h-7 text-[#C5A059]" />
                     </div>
                     <div>
                        <p className="text-base font-bold text-white tracking-tight">Two-Factor Authentication</p>
                        <p className="text-xs text-white/30 mt-1">Additional verification for institutional security.</p>
                     </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#C5A059] data-[state=unchecked]:bg-white/10" />
               </div>

               <Separator className="bg-white/[0.03]" />

               <div className="max-w-md space-y-8">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-brand font-black uppercase tracking-[0.3em] text-white/20 ml-1">Current Key</Label>
                     <Input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••" 
                      className="bg-white/[0.03] border-white/5 h-14 rounded-2xl text-white focus-visible:ring-[#C5A059]/30 transition-premium" 
                     />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-brand font-black uppercase tracking-[0.3em] text-white/20 ml-1">New Key Vector</Label>
                     <Input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Define New Cipher" 
                      className="bg-white/[0.03] border-white/5 h-14 rounded-2xl text-white focus-visible:ring-[#C5A059]/30 transition-premium" 
                     />
                  </div>
                  <Button 
                    onClick={handleUpdatePassword}
                    disabled={isLoading || !newPassword || !currentPassword}
                    className="w-full h-14 rounded-2xl glass-button-active font-brand font-black uppercase text-[10px] tracking-widest shadow-2xl transition-premium disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Update Protocol
                  </Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
