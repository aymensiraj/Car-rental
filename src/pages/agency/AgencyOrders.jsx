import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, User, Hash, Tag, Loader2 } from 'lucide-react';
import { orderService } from '../../services/orderService'; // 🏢 الـ Service الجديد

const statusConfig = {
  en_attente: { label: 'In Queue', icon: Clock, badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
  pending: { label: 'In Queue', icon: Clock, badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
  accepte: { label: 'Confirmed', icon: CheckCircle, badge: 'bg-green-500/10 border-green-500/20 text-green-500' },
  accepted: { label: 'Confirmed', icon: CheckCircle, badge: 'bg-green-500/10 border-green-500/20 text-green-500' },
  refuse: { label: 'Declined', icon: XCircle, badge: 'bg-red-500/10 border-red-500/20 text-red-500' },
  refused: { label: 'Declined', icon: XCircle, badge: 'bg-red-500/10 border-red-500/20 text-red-500' },
  completed: { label: 'Finalized', icon: CheckCircle, badge: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
};

export default function AgencyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // 🔄 جيب الطلبات د الوكالة من الباكيند نيشان
  const fetchAgencyOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders();
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching agency orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyOrders();
  }, []);

  // 🏢 ميثود قبول الطلب
  const handleAccept = async (orderId) => {
    try {
      const data = await orderService.acceptOrder(orderId);
      if (data.success) {
        // تحديث الحالة ف الـ State بلا ما نـعاودو نـشـارجيو الـ صفحة كاملو
        setMyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepte' } : o));
      }
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  // 🏢 ميثود رفض الطلب
  const handleRefuse = async (orderId) => {
    try {
      const data = await orderService.refuseOrder(orderId);
      if (data.success) {
        setMyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'refuse' } : o));
      }
    } catch (error) {
      console.error("Error refusing order:", error);
    }
  };

  // 🎛️ الـ فـلـتـرة الذكية
  const filtered = filter === 'all' 
    ? myOrders 
    : myOrders.filter(o => {
        if (filter === 'pending') return o.status === 'pending' || o.status === 'en_attente';
        if (filter === 'accepted') return o.status === 'accepted' || o.status === 'accepte';
        if (filter === 'refused') return o.status === 'refused' || o.status === 'refuse';
        return o.status === filter;
      });

  // الـ عدادات الفوقانية
  const counts = {
    all: myOrders.length,
    pending: myOrders.filter(o => o.status === 'pending' || o.status === 'en_attente').length,
    accepted: myOrders.filter(o => o.status === 'accepted' || o.status === 'accepte').length,
    refused: myOrders.filter(o => o.status === 'refused' || o.status === 'refuse').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
              <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] italic">Operations Center</p>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
              Booking <span className="text-orange-600">Requests</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-4 font-bold italic uppercase text-xs tracking-widest">
              Monitoring {myOrders.length} active transactions
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { key: 'all', label: 'All Operations', count: counts.all, active: 'bg-slate-900 dark:bg-white text-white dark:text-black' },
            { key: 'pending', label: 'In Queue', count: counts.pending, active: 'bg-orange-600 text-white' },
            { key: 'accepted', label: 'Confirmed', count: counts.accepted, active: 'bg-green-600 text-white' },
            { key: 'refused', label: 'Declined', count: counts.refused, active: 'bg-red-600 text-white' },
          ].map(tab => (
            <button 
              key={tab.key} 
              onClick={() => setFilter(tab.key)}
              className={`cursor-pointer group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all ${
                filter === tab.key 
                ? tab.active + ' shadow-lg scale-105' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-[9px] ${filter === tab.key ? 'bg-black/20 dark:bg-black/10' : 'bg-slate-200 dark:bg-white/10'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
             <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">No matching records found in system</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered
              .sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime())
              .map(order => {
                const cfg = statusConfig[order.status] || statusConfig.en_attente;
                // 💡 هنا دمجنا قراءة البيانات سواء من العلاقة مع الـ car ف الباكيند أو مباشرة
                const carInfo = order.car || {};
                const clientInfo = order.user || {};

                return (
                  <div key={order.id} className="group bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 hover:border-orange-600/50 transition-all duration-500">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      
                      {/* Left: Unit & Client Info */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        <div className="relative shrink-0">
                          <img 
                           src={
                              carInfo.image_url ||
                              (carInfo.image ? `http://localhost:8000/storage/${carInfo.image}` : null) ||
                              order.carImage ||
                              '/placeholder-car.jpg'
                            }
                            alt={`${carInfo.brand || order.carBrand}`}
                            className="w-32 h-24 rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute -bottom-2 -right-2 bg-orange-600 p-2 rounded-xl text-white shadow-lg">
                            <Tag size={12} />
                          </div>
                        </div>

                        <div className="text-center sm:text-left">
                          <h3 className="text-slate-900 dark:text-white font-black text-2xl italic uppercase tracking-tighter mb-1">
                            {carInfo.brand || order.carBrand} <span className="text-orange-600">{carInfo.model || order.carModel}</span>
                          </h3>
                          
                          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-200 dark:bg-white/10 rounded-lg text-slate-500">
                                <User size={12} />
                              </div>
                              <span className="text-[10px] font-black uppercase italic text-slate-600 dark:text-gray-300 tracking-tight">
                                {clientInfo.name || order.userName}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-200 dark:bg-white/10 rounded-lg text-slate-500">
                                <Calendar size={12} />
                              </div>
                              <span className="text-[10px] font-black uppercase italic text-slate-600 dark:text-gray-300 tracking-tight">
                                {order.start_date || order.startDate} → {order.end_date || order.endDate}
                              </span>
                              <span className="bg-orange-600/10 text-orange-600 px-2 py-0.5 rounded text-[9px] font-black italic">
                                {order.days || Math.ceil((new Date(order.end_date) - new Date(order.start_date)) / (1000 * 60 * 60 * 24))} DAYS
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Financials & Status */}
                      <div className="flex flex-col items-center lg:items-end justify-center gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-white/5">
                        <div className="text-center lg:text-right">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 italic mb-1">Total Transaction</p>
                          <p className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter leading-none">
                            {order.total_price || order.totalPrice} <span className="text-xs text-orange-600">MAD</span>
                          </p>
                        </div>
                        
                        <div className={` cursor-pointer flex items-center gap-2 border px-6 py-2 rounded-2xl text-[9px] font-black uppercase italic tracking-[0.2em] ${cfg.badge}`}>
                          <cfg.icon size={14} strokeWidth={3} />
                          {cfg.label}
                        </div>

                        {/* Control Deck for Pending Orders */}
                        {(order.status === 'pending' || order.status === 'en_attente') && (
                          <div className="flex gap-3 mt-2">
                            <button
                              onClick={() => handleAccept(order.id)}
                              className="cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white p-3 rounded-xl transition-all shadow-xl shadow-black/10"
                              title="Confirm Request"
                            >
                              <CheckCircle size={18} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => handleRefuse(order.id)}
                              className="cursor-pointer bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all shadow-xl shadow-red-500/10"
                              title="Decline Request"
                            >
                              <XCircle size={18} strokeWidth={3} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* System Footer */}
                    <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-gray-600">
                        <Hash size={10} />
                        <span className="text-[9px] font-black uppercase tracking-tighter italic">LOG_REF_{String(order.id).slice(0, 8)}</span>
                      </div>
                      <p className="text-slate-400 dark:text-gray-600 text-[9px] font-black uppercase italic">
                        TIMESTAMP: {order.created_at || order.createdAt}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}