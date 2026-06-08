import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Car, Building2, ClipboardList, TrendingUp, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

import adminService from '../../services/adminService';

const Loader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center">
    <p className="text-orange-600 font-black italic animate-pulse tracking-widest">
      CONNECTING TO AUTODRIVE SERVERS...
    </p>
  </div>
);

const ErrorBanner = ({ message }) => (
  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold text-sm text-center">
    {message}
  </div>
);

const Header = () => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-[2px] bg-orange-600"></div>
        <p className="text-orange-600 font-black italic uppercase tracking-[0.3em] text-[10px]">System Overview</p>
      </div>
      <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
        Control <span className="text-orange-600">Center</span>
      </h1>
      <p className="text-slate-500 dark:text-gray-500 mt-3 font-bold italic uppercase text-xs tracking-widest">
        Live metrics for the AutoDrive Pro ecosystem.
      </p>
    </div>
    <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-2xl shadow-sm backdrop-blur-md">
      <ShieldCheck className="text-orange-600" size={20} />
      <span className="text-xs font-black italic uppercase tracking-widest">
        Super Admin <span className="text-orange-600 ml-1">Verified</span>
      </span>
    </div>
  </div>
);

const KpiCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent border-l-4 border-l-orange-600 dark:border-l-orange-600 rounded-r-3xl p-6 shadow-sm hover:shadow-md dark:hover:bg-white/10 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <Icon size={22} className="text-orange-600 group-hover:scale-110 transition-transform" />
      <Activity size={14} className="text-slate-300 dark:text-gray-700" />
    </div>
    <p className="text-4xl font-black italic tracking-tighter mb-1">{value}</p>
    <p className="text-slate-500 dark:text-gray-500 font-black italic uppercase text-[10px] tracking-[0.2em]">{label}</p>
  </div>
);

const RevenueHero = ({ total, growth, ordersCount }) => (
  <div className="relative overflow-hidden bg-orange-600 rounded-[2.5rem] p-8 mb-10 shadow-2xl shadow-orange-600/30 text-white">
    <div className="absolute right-[-5%] top-[-20%] text-[15rem] font-black italic text-orange-700 opacity-20 pointer-events-none select-none">
      CASH
    </div>
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
      <div>
        <p className="text-orange-100 font-black italic uppercase text-xs tracking-widest mb-2">Total Platform Revenue</p>
        <h2 className="text-6xl font-black italic tracking-tighter">
          {Number(total).toLocaleString()} <span className="text-2xl uppercase">Mad</span>
        </h2>
        <div className="mt-4 inline-flex items-center gap-2 bg-orange-700/50 px-4 py-2 rounded-full border border-orange-400/20">
          <TrendingUp size={16} />
          <span className="font-black italic text-xs uppercase tracking-wider">+{growth}% Monthly Growth</span>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 min-w-[200px]">
        <p className="text-orange-100 font-black italic uppercase text-[10px] tracking-widest mb-1">Total Fleet Orders</p>
        <p className="text-4xl font-black italic">{ordersCount}</p>
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    agenciesCount: 0,
    carsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    monthlyRevenue: [],
    ordersByStatus: [],
    carsByCategory: []
  });
  
  const [eliteAgencies, setEliteAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // العيـاط على السيرفيس نيشان بلا axios هنا
        const data = await adminService.getDashboardStats();
        setStats(data);
        
        if (data.eliteAgencies) {
          setEliteAgencies(data.eliteAgencies);
        } else {
          const agenciesData = await adminService.getAgencies();
          setEliteAgencies(agenciesData);
        }
        setError('');
      } catch (err) {
        setError("Impossible de charger les statistiques du système.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  const kpiList = [
    { label: 'Utilisateurs', value: stats.usersCount, icon: Users },
    { label: 'Agences', value: stats.agenciesCount, icon: Building2 },
    { label: 'Voitures', value: stats.carsCount, icon: Car },
    { label: 'Demandes', value: stats.ordersCount, icon: ClipboardList },
  ];

  const PIE_COLORS = ['#EA580C', '#64748b', '#94a3b8'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {error && <ErrorBanner message={error} />}
        <Header />

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiList.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
        </div>

        {/* Hero Revenue */}
        <RevenueHero 
          total={stats.totalRevenue} 
          growth={stats.monthlyGrowth} 
          ordersCount={stats.ordersCount} 
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Area Chart: Revenue */}
          <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="font-black italic text-sm uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
              Revenue Analytics (MAD)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats.monthlyRevenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-white/5" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }} itemStyle={{ color: '#EA580C', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="revenue" stroke="#EA580C" fill="url(#rev)" strokeWidth={4} dot={{ fill: '#EA580C', r: 4 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Status */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm text-center">
            <h3 className="font-black italic text-sm uppercase tracking-widest mb-8">Order Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.ordersByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {stats.ordersByStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {stats.ordersByStatus.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                   <span className="text-[10px] font-black italic uppercase tracking-tighter text-slate-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bar Chart: Composition */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="font-black italic text-sm uppercase tracking-widest mb-8">Fleet Composition</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.carsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-white/5" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'currentColor', className: 'text-slate-50 dark:text-white/5' }} />
                <Bar dataKey="count" fill="#EA580C" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Elite Partners List */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black italic text-sm uppercase tracking-widest">Elite Partners</h3>
              <Link to="/admin/accounts" className="group flex items-center gap-2 text-orange-600 font-black italic uppercase text-[10px] tracking-widest">
                View All <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-4">
              {eliteAgencies.slice(0, 3).map((ag, i) => (
                <div key={ag.id} className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-4 hover:border-orange-600/30 transition-all">
                  <div className="relative">
                    <div className="absolute z-10 -top-2 -left-2 w-6 h-6 bg-orange-600 text-white flex items-center justify-center rounded-lg text-[10px] font-black italic">
                      {i + 1}
                    </div>
                    <img 
                      src={
                        ag.logo
                          ? ag.logo.startsWith('http')
                            ? ag.logo
                            : `http://localhost:8000/storage/${ag.logo}`
                          : '/default-agency.png'
                      }
                      alt={ag.name} 
                      className="w-14 h-14 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all shadow-sm" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-black italic uppercase tracking-tighter text-lg">{ag.name}</p>
                    <p className="text-slate-500 dark:text-gray-500 font-bold italic uppercase text-[9px] tracking-widest">
                      {ag.city || "Casablanca"} • {ag.cars_count || 0} Units
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600 font-black italic text-lg">★ {ag.rating || "5.0"}</p>
                    <p className="text-slate-400 dark:text-gray-600 font-black italic uppercase text-[8px]">Partner Score</p>
                  </div>
                </div>
              ))}
              {eliteAgencies.length === 0 && (
                <p className="text-slate-400 text-xs italic text-center py-6">Aucune agence d'élite trouvée.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}