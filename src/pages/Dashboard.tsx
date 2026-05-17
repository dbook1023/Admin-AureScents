import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Droplet, 
  Tags, 
  UserCircle,
  ArrowUpRight, 
  ArrowDownRight,
  FileDown
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { useSearch } from '@/context/SearchContext';

const monthLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const defaultChartData = monthLabels.map((name) => ({ name, likes: 0, entries: 0 }));

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <Card className="glass-card rounded-[2.5rem] p-1.5 hover:scale-[1.02] transition-premium group relative group overflow-hidden">
    <CardContent className="p-7 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-[#C5A059] group-hover:text-[#0A192F] transition-premium shadow-2xl">
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg",
          trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}
        </div>
      </div>
      <div>
        <h3 className="text-white/30 text-[10px] font-brand font-black uppercase tracking-[0.3em] ml-1">{title}</h3>
        <p className="text-4xl font-brand font-black text-white mt-2 tracking-tighter ml-0.5">{value}</p>
      </div>
    </CardContent>
    {/* Animated background glow on hover */}
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C5A059]/5 blur-[60px] rounded-full group-hover:bg-[#C5A059]/10 transition-premium"></div>
  </Card>
);

const Dashboard: React.FC = () => {
  const { searchQuery } = useSearch();
  const [stats, setStats] = useState({ users: 0, entries: 0, brands: 0, perfumers: 0 });
  const [chartData, setChartData] = useState(defaultChartData);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const fromDate = oneYearAgo.toISOString();

      const [profilesResp, perfumesCountResp, brandsResp, perfumersResp, recentPerfumesResp, monthlyPerfumesResp] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('perfumes').select('id', { count: 'exact', head: true }),
        supabase.from('perfume_brands').select('id', { count: 'exact', head: true }),
        supabase.from('perfumers').select('id', { count: 'exact', head: true }),
        supabase.from('perfumes').select('id,name,brand,short_description,is_archived,created_at').order('created_at', { ascending: false }).limit(4),
        supabase.from('perfumes').select('created_at').gte('created_at', fromDate),
      ]);

      if (profilesResp.error) console.error('Dashboard profiles count error:', profilesResp.error.message);
      if (perfumesCountResp.error) console.error('Dashboard perfumes count error:', perfumesCountResp.error.message);
      if (brandsResp.error) console.error('Dashboard brands count error:', brandsResp.error.message);
      if (perfumersResp.error) console.error('Dashboard perfumers count error:', perfumersResp.error.message);

      const usersCount = profilesResp.count ?? 0;
      const entriesCount = perfumesCountResp.count ?? 0;
      const brandsCount = brandsResp.count ?? 0;
      const perfumersCount = perfumersResp.count ?? 0;
      const currentMonthKey = monthLabels[new Date().getMonth()];

      const activityMap = monthLabels.reduce((acc, month) => {
        acc[month] = { likes: 0, entries: 0 };
        return acc;
      }, {} as Record<string, { likes: number; entries: number }>);

      const monthFromDate = (value: string | null | undefined) => {
        if (!value) return null;
        const date = new Date(value);
        return monthLabels[date.getMonth()];
      };

      monthlyPerfumesResp.data?.forEach((row: any) => {
        const month = monthFromDate(row.created_at);
        if (month) activityMap[month].entries += 1;
      });

      activityMap[currentMonthKey].likes = perfumersCount;

      setStats({ users: usersCount, entries: entriesCount, brands: brandsCount, perfumers: perfumersCount });
      setChartData(monthLabels.map((name) => ({ name, ...activityMap[name] })));
      setRecentEntries(recentPerfumesResp.data || []);
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 pb-8 font-ui">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-brand font-black text-white tracking-tight uppercase">Executive Overview</h1>
          <p className="text-white/40 mt-1 font-medium text-sm">Comprehensive overview of the AURE SCENTS Encyclopedia library.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Users" value={stats.users.toLocaleString()} icon={Users} trend="up" trendValue={stats.users > 0 ? `${stats.users} TOTAL` : 'NO DATA'} />
        <StatCard title="Encyclopedia Entries" value={stats.entries.toLocaleString()} icon={Droplet} trend="up" trendValue={stats.entries > 0 ? `${stats.entries} TOTAL` : 'NO DATA'} />
        <StatCard title="Affiliated Brands" value={stats.brands.toLocaleString()} icon={Tags} trend="up" trendValue={stats.brands > 0 ? `${stats.brands} TOTAL` : 'NO DATA'} />
        <StatCard title="Total Perfumers" value={stats.perfumers.toLocaleString()} icon={UserCircle} trend="up" trendValue={stats.perfumers > 0 ? `${stats.perfumers} TOTAL` : 'NO DATA'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card p-6 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-2 mb-6">
            <CardTitle className="text-white text-lg font-brand font-black uppercase tracking-tight">Engagement Trend</CardTitle>
            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Global Community Interaction Index</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="likes" stroke="#C5A059" strokeWidth={4} fillOpacity={1} fill="url(#colorLikes)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card p-6 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-2 mb-6">
            <CardTitle className="text-white text-lg font-brand font-black uppercase tracking-tight">Library Expansion</CardTitle>
            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Monthly New Entry Publications</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                  contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="entries" fill="#C5A059" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 flex flex-row items-center justify-between gap-4 border-b border-white/5">
          <div>
            <CardTitle className="text-white text-xl font-brand font-black uppercase tracking-tight">Recent Scholarly Curation</CardTitle>
            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">High-fidelity entry candidate verification logs.</CardDescription>
          </div>
          <Button variant="ghost" className="text-[#C5A059] font-black uppercase text-[10px] tracking-widest hover:bg-white/[0.03]">Full Library Index</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="px-8 py-5 text-[10px] font-brand font-black text-white/30 uppercase tracking-[0.2em]">Fragrance Entry</th>
                  <th className="px-8 py-5 text-[10px] font-brand font-black text-white/30 uppercase tracking-[0.2em]">House</th>
                  <th className="px-8 py-5 text-[10px] font-brand font-black text-white/30 uppercase tracking-[0.2em]">Created</th>
                  <th className="px-8 py-5 text-[10px] font-brand font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentEntries.filter(p => 
                  !searchQuery || 
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  p.brand.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((p, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-premium group">
                    <td className="px-8 py-5 font-bold text-white text-sm tracking-tight group-hover:text-[#C5A059] transition-premium">{p.name}</td>
                    <td className="px-8 py-5 text-white/40 font-medium text-xs font-brand uppercase tracking-widest">{p.brand}</td>
                    <td className="px-8 py-5 text-white/40 font-medium text-xs uppercase tracking-[0.2em]">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${p.is_archived ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {p.is_archived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
