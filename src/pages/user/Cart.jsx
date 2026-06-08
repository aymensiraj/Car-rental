import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Calendar, CheckCircle, ArrowRight, Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext'; 
import { orderService } from '../../services/orderService.js';

export default function Cart() {
 
  const { cart, removeFromCart, clearCart } = useApp();
  
  
  const { currentUser, currentRole } = useAuth();
  
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const total = cart.reduce((s, i) => {
    const price = Number(i.car?.price_per_day) || 0;
    const days = Number(i.duration) || 1;
    return s + (price * days);
  }, 0);

  const handleSubmit = async () => {
    
    const userRole = currentRole || currentUser?.role;

   
    console.log("=== DEBUG AUTH IN CART ===");
    console.log("User الحالي:", currentUser);
    console.log("الـ Role الحالي:", userRole);

    if (!currentUser) {
      alert("Veuillez vous connecter pour continuer.");
      return;
    }

    if (userRole && userRole !== 'user') {
      alert("Seuls les clients peuvent effectuer des réservations.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // الـ Loop على السيارات ونصيفطوهم لـ Laravel
      for (const item of cart) {
        const orderData = {
          car_id: item.car.id,
          start_date: item.startDate,
          end_date: item.endDate,
        };

        await orderService.createOrder(orderData);
      }

      clearCart();
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        navigate('/my-orders'); 
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de la validation de votre commande.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center transition-colors duration-500">
      <div className="text-center animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-orange-600/20 rounded-full animate-ping opacity-20" />
          <CheckCircle size={64} className="text-orange-600 relative z-10" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Demande <span className="text-orange-600">Transmise</span>
        </h2>
        <p className="text-slate-500 dark:text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Préparation de votre dossier en cours...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* --- HEADER --- */}
        <div className="mb-20 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-12 bg-orange-600 rounded-full"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-600 italic">Votre Sélection</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-4">
            Mon <span className="text-orange-600 font-outline-2">Panier</span>
          </h1>
          {cart.length > 0 && (
             <p className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest ml-1">
               {cart.length} véhicule{cart.length > 1 ? 's' : ''} prêt{cart.length > 1 ? 's' : ''} pour la route
             </p>
          )}
        </div>

        {/* --- DISPLAY ERROR --- */}
        {error && (
          <div className="mb-10 p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl flex items-center gap-4 text-xs font-black uppercase tracking-wider">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[4rem] p-32 text-center bg-slate-50/30 dark:bg-white/[0.01]">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
              <ShoppingCart size={40} className="text-slate-300 dark:text-gray-800" />
            </div>
            <h2 className="text-3xl font-black text-slate-300 dark:text-gray-700 mb-6 uppercase italic tracking-tighter leading-none">Votre garage est vide</h2>
            <button 
              onClick={() => navigate('/store')} 
              className="cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-black px-12 py-6 rounded-2xl font-black flex items-center gap-4 mx-auto transition-all hover:bg-orange-600 hover:text-white active:scale-95 shadow-xl uppercase tracking-widest text-[10px]"
            >
              Explorer le catalogue <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* --- ITEMS LIST --- */}
            <div className="lg:col-span-2 space-y-10">
              {cart.map(item => {
                const itemPrice = Number(item.car?.price_per_day) || 0;
                const itemDuration = Number(item.duration) || 1;
                const itemSubtotal = itemPrice * itemDuration;

                return (
                  <div key={item.car.id} className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3.5rem] overflow-hidden flex flex-col sm:flex-row transition-all duration-700 hover:border-orange-500/30 hover:shadow-2xl">
                    
                    {/* Car Image Area */}
                    <div className="relative w-full sm:w-72 h-60 sm:h-auto shrink-0 overflow-hidden">
                      <img 
                        src={item.car.image_url || item.car.image || '/placeholder-car.jpg'} 
                        alt={item.car.model} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                    </div>
                    
                    {/* Details Area */}
                    <div className="p-10 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-3">
                            <h3 className="text-slate-900 dark:text-white font-black text-3xl uppercase italic tracking-tighter leading-none">
                              {item.car.brand} <span className="text-slate-400 dark:text-gray-600 not-italic font-medium">{item.car.model}</span>
                            </h3>
                            <div className="flex items-center gap-2 text-orange-600">
                               <Building2 size={14} />
                               <span className="text-[10px] font-black uppercase tracking-widest italic">{item.car.agency_name || 'AutoDrive'}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.car.id)} 
                            className="cursor-pointer w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-500 border border-slate-100 dark:border-white/10"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-white/5">
                          <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-orange-600" />
                            <div>
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Période</p>
                               <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter italic">
                                 {item.startDate} — {item.endDate}
                               </p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Durée</p>
                             <p className="text-sm font-black text-slate-900 dark:text-white italic">{itemDuration} JOURS</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 flex items-end justify-between">
                        <div className="flex items-center gap-2 text-slate-300 dark:text-gray-700">
                          <ShieldCheck size={16} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Assurance incluse</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sous-total</p>
                          <p className="font-black text-slate-900 dark:text-white text-4xl tracking-tighter italic leading-none">
                            {itemSubtotal} <span className="text-sm text-orange-600 not-italic font-bold">MAD</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- SUMMARY STICKY --- */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 dark:bg-white/[0.03] border border-slate-900 dark:border-white/10 rounded-[3.5rem] p-12 sticky top-28 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[50px] rounded-full group-hover:bg-orange-600/20 transition-all duration-700" />
                
                <h3 className="font-black text-2xl mb-10 tracking-tighter uppercase italic text-white">Récapitulatif</h3>
                
                <div className="space-y-6 mb-12">
                  {cart.map(item => {
                    const itemPrice = Number(item.car?.price_per_day) || 0;
                    const itemDuration = Number(item.duration) || 1;
                    return (
                      <div key={item.car.id} className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">{item.car.brand} {item.car.model}</span>
                        <span className="text-white font-black italic">{itemPrice * itemDuration} MAD</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/10 pt-10 mb-12">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Total à régler</p>
                  <p className="text-6xl font-black text-orange-600 tracking-tighter italic leading-none">
                    {total} <span className="text-xl not-italic text-white">MAD</span>
                  </p>
                  <div className="flex items-start gap-3 mt-8 opacity-50">
                    <div className="mt-1"><ShieldCheck size={12} className="text-white" /></div>
                    <p className="text-white text-[8px] leading-relaxed uppercase font-bold italic tracking-tight">
                      Le paiement s'effectue en agence après inspection du véhicule et signature du contrat.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleSubmit} 
                  disabled={loading || cart.length === 0}
                  className="cursor-pointer w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-7 rounded-2xl mb-6 flex items-center justify-center gap-4 transition-all transform active:scale-95 shadow-xl shadow-orange-900/20 uppercase tracking-widest text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'TRAITEMENT EN COURS...' : <>Confirmer la réservation <ArrowRight size={18} /></>}
                </button>
                
                <button 
                  onClick={clearCart} 
                  disabled={loading}
                  className="cursor-pointer w-full text-gray-500 hover:text-rose-500 text-[9px] font-black py-2 transition-colors uppercase tracking-[0.3em] disabled:opacity-30"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}