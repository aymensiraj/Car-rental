import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, Car, Calendar, Building2, Star, ArrowUpRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
  en_attente: { 
    label: 'En attente', 
    icon: Clock, 
    color: 'text-amber-600 dark:text-amber-500', 
    bg: 'bg-amber-50 dark:bg-amber-500/10', 
    border: 'border-amber-200 dark:border-amber-500/20' 
  },
  accepte: { 
    label: 'Acceptée', 
    icon: CheckCircle, 
    color: 'text-emerald-600 dark:text-emerald-500', 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
    border: 'border-emerald-200 dark:border-emerald-500/20' 
  },
  refuse: { 
    label: 'Refusée', 
    icon: XCircle, 
    color: 'text-rose-600 dark:text-rose-500', 
    bg: 'bg-rose-50 dark:bg-rose-500/10', 
    border: 'border-rose-200 dark:border-rose-500/20' 
  },
  completed: { 
    label: 'Terminée', 
    icon: Star, 
    color: 'text-orange-600 dark:text-orange-500', 
    bg: 'bg-orange-50 dark:bg-orange-500/10', 
    border: 'border-orange-200 dark:border-orange-500/20' 
  },
};

export default function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrdersDirectly = async () => {
      try {
        const response = await orderService.getUserOrders();
        if (response && response.success && Array.isArray(response.orders)) {
          setMyOrders(response.orders);
        } else if (Array.isArray(response)) {
          setMyOrders(response);
        }
      } catch (error) {
        // Order loading failed
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersDirectly();
  }, [user]);

  const counts = {
    en_attente: myOrders.filter(o => o.status === 'en_attente' || o.status === 'pending').length,
    accepte: myOrders.filter(o => o.status === 'accepte' || o.status === 'accepted').length,
    refuse: myOrders.filter(o => o.status === 'refuse' || o.status === 'refused').length,
    completed: myOrders.filter(o => o.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <p className="text-orange-600 font-bold tracking-widest uppercase animate-pulse">Chargement de votre garage...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* --- HEADER --- */}
        <div className="mb-20 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-12 bg-orange-600 rounded-full"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-600 italic">Tableau de bord</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-4">
            Mes <span className="text-orange-600">Réservations</span>
          </h1>
          <p className="text-slate-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest ml-1">
            Suivi en temps réel de votre parc automobile
          </p>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className={`relative group border rounded-[2.5rem] p-10 transition-all duration-700 bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden ${config.border} hover:shadow-2xl hover:shadow-orange-600/5`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <config.icon size={60} />
              </div>
              <config.icon size={28} className={`${config.color} mb-8 relative z-10`} />
              <p className="text-5xl font-black tracking-tighter italic relative z-10">{counts[key] || 0}</p>
              <p className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mt-3 relative z-10">{config.label}</p>
            </div>
          ))}
        </div>

        {/* --- ORDERS LIST HEADER --- */}
        <div className="space-y-4 mb-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
          <span className="text-[10px] font-black text-slate-300 dark:text-gray-600 uppercase tracking-[0.3em]">Historique détaillé</span>
          <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
        </div>

        {/* --- ORDERS LIST OR EMPTY STATE --- */}
        {myOrders.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[4rem] bg-slate-50/30 dark:bg-white/[0.01]">
            <Car size={48} className="mx-auto text-slate-200 dark:text-gray-800 mb-8" />
            <h3 className="text-2xl font-black text-slate-300 dark:text-gray-700 uppercase italic tracking-tighter">Le garage est vide</h3>
            <p className="text-slate-400 text-[10px] font-bold mt-4 uppercase tracking-[0.2em]">Commencez par choisir votre prochaine machine</p>
          </div>
        ) : (
          <div className="space-y-10">
            {myOrders.map(order => {
              const cfg = statusConfig[order.status] || statusConfig.en_attente;
              
              const carData = order.car || {};
              const brand = carData.brand || order.carBrand || 'Machine';
              const model = carData.model || order.carModel || '';
              const image = carData.image_url 
              || (carData.image ? `http://localhost:8000/storage/${carData.image}` : null)
              || order.carImage 
              || '/placeholder-car.jpg';
              const agency = carData.agency_name || order.agencyName || 'Casablanca Cars';
              
              const startDate = order.start_date || order.startDate || '—';
              const endDate = order.end_date || order.endDate || '—';
              const totalPrice = order.total_price || order.totalPrice || 0;

              return (
                <div key={order.id} className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3.5rem] overflow-hidden transition-all duration-700 hover:border-orange-500/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-orange-900/5 shadow-sm">
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* صورة السيارة */}
                    <div className="lg:w-96 h-72 lg:h-auto overflow-hidden relative shrink-0">
                      <img src={image} alt={`${brand} ${model}`} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent lg:hidden" />
                      
                      <div className="absolute top-8 left-8 lg:hidden">
                         <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-xl ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                           {cfg.label}
                         </div>
                      </div>
                    </div>

                    <div className="p-12 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-4">
                          <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-slate-900 dark:text-white">
                            {brand} <span className="text-slate-400 dark:text-gray-500 not-italic font-medium">{model}</span>
                          </h3>
                          <div className="flex items-center gap-3 text-slate-500">
                            <Building2 size={16} className="text-orange-600" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{agency}</span>
                          </div>
                        </div>
                        
                        <div className={`hidden lg:block px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500 group-hover:shadow-lg ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {cfg.label}
                        </div>
                      </div>

                      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-end pt-10 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                             <Calendar size={20} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Période de location</p>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter italic">
                              {startDate} <span className="text-orange-600 mx-2">—</span> {endDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between md:justify-end items-end gap-10">
                          <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total payé</p>
                            <p className="text-4xl font-black text-orange-600 italic tracking-tighter leading-none">
                              {totalPrice} <span className="text-xs ml-1">MAD</span>
                            </p>
                          </div>
                        </div>

                        {(order.status === 'accepte' || order.status === 'accepted') && (
                          <button
                              onClick={() => orderService.handleDownloadPdf(order.id)}
                              className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-600/20"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                              Télécharger PDF
                          </button>
                      )}
                      </div>

                    </div>
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