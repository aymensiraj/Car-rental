import { useState, useEffect } from 'react';
import { Car, ClipboardList, TrendingUp, Users, Clock, ArrowUpRight, Activity, Wallet, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { getAgencyDashboardStats } from '../../services/orderService';

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#6366F1'];

export default function AgencyDashboard() {
  const { currentUser } = useApp();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    kpis: { fleetSize: 0, totalOrders: 0, pendingOrders: 0, revenue: 0 },
    monthlyRevenue: [],
    statusDistribution: [],
    recentOrders: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await getAgencyDashboardStats();
        setDashboardData(data);
      } catch (error) {
        // Dashboard stats fetch failed
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    { label: 'Fleet Size', value: dashboardData.kpis.fleetSize, icon: Car, trend: 'Total Units', colorClass: 'bg-orange-600/5 text-orange-600' },
    { label: 'Total Orders', value: dashboardData.kpis.totalOrders, icon: ClipboardList, trend: 'All time', colorClass: 'bg-blue-600/5 text-blue-600' },
    { label: 'Pending', value: dashboardData.kpis.pendingOrders, icon: Clock, trend: 'Action required', colorClass: 'bg-indigo-600/5 text-indigo-600' },
    { label: 'Estimated Revenue', value: `${(dashboardData.kpis?.revenue ? Number(dashboardData.kpis.revenue) : 0).toLocaleString()} MAD`, icon: Wallet, trend: 'Net Profit', colorClass: 'bg-green-600/5 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
              <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] italic">Management Portal</p>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
              Agency <span className="text-orange-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-4 font-bold italic uppercase text-xs tracking-widest">
              Welcome back, <span className="text-orange-600">{currentUser?.name}</span>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2 rounded-2xl flex items-center gap-3 pr-6 backdrop-blur-md">
            <div className="p-3 bg-orange-600 rounded-xl shadow-lg shadow-orange-600/20 text-white">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest leading-none">System Status</p>
              <p className="text-xs font-black dark:text-white uppercase italic">Optimal Performance</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpiCards.map((kpi, idx) => (
            <div key={idx} className="group relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 transition-all hover:scale-[1.02] hover:border-orange-600/50 overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl border border-slate-100 dark:border-white/10 transition-colors ${kpi.colorClass}`}>
                  <kpi.icon size={22} />
                </div>
                <span className="text-[10px] font-black uppercase italic text-orange-600">{kpi.trend}</span>
              </div>
              <p className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-1 uppercase">{kpi.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 italic">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Revenue Chart */}
          <div className="lg:col-span-8 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-xl italic uppercase tracking-tighter flex items-center gap-3 text-slate-900 dark:text-white">
                <TrendingUp size={24} className="text-orange-600" /> Revenue Analysis
              </h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-orange-600/10 text-orange-600 text-[10px] font-black uppercase italic rounded-lg">Monthly</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" vertical={false} opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: '900' }}
                  cursor={{ stroke: '#EA580C', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EA580C" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 text-center">
            <h3 className="font-black text-xl italic uppercase tracking-tighter text-slate-900 dark:text-white mb-8 text-left">Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={dashboardData.statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {dashboardData.statusDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" formatter={(value) => <span className="text-[10px] font-black uppercase italic text-slate-500 dark:text-gray-400">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <h3 className="font-black text-xl italic uppercase tracking-tighter flex items-center gap-3 text-slate-900 dark:text-white">
              <Users size={24} className="text-orange-600" /> Recent Operations
            </h3>
            <Link to="/agency/orders" className="group px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase italic rounded-xl hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all flex items-center gap-2">
              View History <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {dashboardData.recentOrders.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
              <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">No active operations detected</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 dark:text-gray-500 border-b border-slate-200 dark:border-white/10">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] italic">Client Name</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] italic">Vehicle Unit</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] italic">Timeline</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] italic">Value</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] italic">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {dashboardData.recentOrders.map(order => {
                    const statusMap = {
                      en_attente: { label: 'In Queue', class: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
                      accepte: { label: 'Confirmed', class: 'text-green-500 bg-green-500/10 border-green-500/20' },
                      refuse: { label: 'Rejected', class: 'text-red-500 bg-red-500/10 border-red-500/20' }
                    };
                    const s = statusMap[order.status] || { label: order.status, class: 'text-gray-500 bg-gray-500/10 border-gray-500/20' };
                    
                    return (
                      <tr key={order.id} className="group hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <td className="py-5">
                          <p className="text-sm font-black dark:text-white uppercase italic">{order.userName}</p>
                          <p className="text-[9px] text-slate-400 font-bold">Verified Client</p>
                        </td>
                        <td className="py-5">
                          <p className="text-xs font-black dark:text-gray-300 uppercase italic tracking-tighter">{order.carBrand} <span className="text-orange-600">{order.carModel}</span></p>
                        </td>
                        <td className="py-5">
                          <p className="text-[10px] font-black dark:text-gray-400 italic">{order.startDate} → {order.endDate}</p>
                        </td>
                        <td className="py-5">
                          <p className="text-sm font-black text-orange-600 italic tracking-tighter">{order.totalPrice} MAD</p>
                        </td>
                        <td className="py-5">
                          <span className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase italic tracking-widest ${s.class}`}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}