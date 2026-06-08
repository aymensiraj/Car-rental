import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Star, MapPin, Fuel, Users, Settings2, Shield, CheckCircle, ShoppingCart, ArrowLeft, Calendar, Info, Zap, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
 

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRole } = useAuth();
  const { cars, addToCart } = useApp();
  
  // مقارنة بـ == حيت الـ id من الـ URL كيكون string ومن Laravel كيكون number
  const car = cars.find(c => c.id == id);

  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [added, setAdded] = useState(false);

  if (!car) return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center text-slate-900 dark:text-white transition-colors duration-500">
      <div className="text-center">
        <div className="w-24 h-24 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info size={40} className="text-orange-600" />
        </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Véhicule Introuvable</h2>
        <button onClick={() => navigate('/store')} className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white transition-all shadow-xl">
          Retour au catalogue
        </button>
      </div>
    </div>
  );

  const days = endDate && startDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0;

  const extrasCost = selectedExtras.reduce((sum, eid) => {
    const e = extrasData.find(x => x.id === eid);
    return sum + (e ? e.price : 0);
  }, 0);

  const total = days > 0 ? (Number(car.price_per_day) + extrasCost) * days : 0;

  const toggleExtra = (id) =>
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const handleAddToCart = () => {
    if (currentRole !== 'user') {
      navigate('/login');
      return;
    }
    if (!endDate || days <= 0) return;
    addToCart({
      car,
      startDate,
      endDate,
      days,
      extras: selectedExtras.map(eid => extrasData.find(x => x.id === eid)?.label || eid),
      totalPrice: total,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-400 hover:text-orange-600 mb-10 transition-all group font-black text-[10px] uppercase tracking-[0.2em]">
          <div className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-orange-600 transition-all">
            <ArrowLeft size={14} />
          </div>
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: MEDIA & DETAILS */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Main Hero Card */}
            <div className="relative rounded-[4rem] overflow-hidden h-[30rem] md:h-[40rem] shadow-2xl border border-slate-200 dark:border-white/5 group">
              <img src={car.image_url || '/placeholder-car.jpg'} alt={car.brand} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              <div className="absolute top-10 left-10 flex gap-3">
                 <span className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border ${car.is_available ? 'bg-orange-600/20 border-orange-600/50 text-orange-500' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`}>
                  {car.is_available ? '✓ Disponible' : '✗ Réservé'}
                </span>
                <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[9px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest">
                  {car.category?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Main Info */}
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] -z-10" />
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-10 bg-orange-600 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 italic">{car.year || 2024} Premium Series</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                    {car.brand} <br />
                    <span className="text-orange-600 font-outline-2 not-italic">{car.model}</span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building2 size={16} className="text-orange-600" />
                      <span className="text-[11px] font-black uppercase tracking-widest italic">{car.agency_name || 'AutoDrive'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Star size={18} fill="currentColor" />
                      <span className="font-black text-lg">{car.rating || 4.8}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 dark:bg-orange-600 p-10 rounded-[3rem] text-center min-w-[220px] shadow-2xl shadow-orange-900/20 transform rotate-3">
                  <p className="text-[10px] font-black text-orange-400 dark:text-orange-200 uppercase tracking-[0.2em] mb-2">Par Jour</p>
                  <p className="text-5xl font-black text-white tracking-tighter italic">{car.price_per_day}<span className="text-xl ml-1">MAD</span></p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-16 max-w-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Description du véhicule</h3>
                <p className="text-slate-500 dark:text-gray-400 leading-relaxed font-medium text-lg">
                  {car.description || "Une machine de haute performance alliant confort et puissance pour vos trajets."}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {[
                  { icon: Users, label: 'Capacité', value: '5 Places' },
                  { icon: Settings2, label: 'Boîte', value: car.transmission === 'automatic' ? 'Automatique' : 'Manuelle' },
                  { icon: Fuel, label: 'Moteur', value: car.fuel_type || 'Essence' },
                  { icon: Shield, label: 'Protection', value: 'Full' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-orange-500/30 group">
                    <item.icon size={26} className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                    <p className="font-black text-sm uppercase tracking-tighter text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING WIDGET */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 dark:bg-white/[0.03] border border-slate-900 dark:border-white/10 rounded-[4rem] p-10 sticky top-28 shadow-2xl overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-600/20 blur-[80px]" />
              
              <div className="flex items-center gap-4 mb-10 relative">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Réservation</h3>
              </div>

              <div className="space-y-8 relative">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Date de départ</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600" />
                    <input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] pl-16 pr-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-600/20 transition-all cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Date de retour</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600" />
                    <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] pl-16 pr-6 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-orange-600/20 transition-all cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Options */}
              

              {/* Total Area */}
              <div className={`mt-10 overflow-hidden transition-all duration-700 ${days > 0 ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white rounded-[2.5rem] p-8 space-y-4 shadow-2xl">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Véhicule ({days} j)</span>
                    <span className="text-slate-900">{car.price_per_day * days} MAD</span>
                  </div>
                  {extrasCost > 0 && (
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Services</span>
                      <span className="text-slate-900">{extrasCost * days} MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end border-t border-slate-100 pt-6 mt-2">
                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Estimation</span>
                    <span className="text-4xl font-black text-orange-600 tracking-tighter italic leading-none">{total} <span className="text-sm">MAD</span></span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!car.is_available || !endDate || days <= 0}
                className={`cursor-pointer w-full mt-10 font-black py-7 rounded-[2.5rem] text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all transform active:scale-95 shadow-2xl ${
                  added ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                  (!car.is_available || !endDate || days <= 0) ? 'bg-white/5 text-gray-600 cursor-not-allowed' :
                  'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/40'
                }`}
              >
                {added ? <><CheckCircle size={20} /> Ajouté au panier</> : <><ShoppingCart size={20} /> Réserver maintenant</>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}