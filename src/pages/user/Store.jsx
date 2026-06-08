import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, Fuel, Users, Settings2, X, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';


const categories = [
  { id: 'Tous', label: 'Tous' },
  { id: 'economique', label: 'Économique' },
  { id: 'suv', label: 'SUV' },
  { id: 'luxe', label: 'Luxe' },
  { id: 'electrique', label: 'Électrique' }
];
const transmissions = ['Tous', 'automatic', 'manual'];
const fuels = ['Tous', 'essence', 'diesel', 'electric', 'hybride'];

export default function Store() {
  const { cars, loading } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [transmission, setTransmission] = useState('Tous');
  const [fuel, setFuel] = useState('Tous');
  const [priceMax, setPriceMax] = useState(2000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] flex items-center justify-center">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-orange-600 animate-pulse">Chargement des machines...</p>
      </div>
    );
  }

  const filtered = cars
    .filter(c => {
      const q = search.toLowerCase();
      // حماية ف حالة كان اسم الوكالة نال
      const agencyName = c.agency_name ? c.agency_name.toLowerCase() : 'AutoDrive';
      
      return (
        ((c.brand?.toLowerCase().includes(q) || c.model?.toLowerCase().includes(q) || agencyName.includes(q))) &&
        (category === 'Tous' || c.category === category) &&
        (transmission === 'Tous' || c.transmission === transmission) &&
        (fuel === 'Tous' || c.fuel === fuel) &&
        Number(c.price_per_day) <= priceMax
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price_per_day - b.price_per_day;
      if (sortBy === 'price-desc') return b.price_per_day - a.price_per_day;
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5);
      return 0;
    });

  const resetFilters = () => {
    setCategory('Tous');
    setTransmission('Tous');
    setFuel('Tous');
    setPriceMax(2000);
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500">
      
      {/* 1. HEADER & SEARCH BAR */}
      <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                Catalogue <span className="text-orange-600">Performance</span>
              </h1>
              <p className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                {filtered.length} Machines prêtes à Casablanca
              </p>
            </div>
            
            <div className="flex flex-1 max-w-3xl gap-3">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Marque, modèle ou agence..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-14 pr-4 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-5 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all border ${
                  showFilters 
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/20' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filtres</span>
              </button>
            </div>
          </div>

          {/* Quick Categories Slider */}
          <div className="flex gap-2 mt-12 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`cursor-pointer px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border italic ${
                  category === cat.id 
                    ? 'bg-slate-900 dark:bg-orange-600 border-slate-900 dark:border-orange-500 text-white shadow-xl shadow-orange-600/20 scale-105' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ADVANCED FILTERS PANEL */}
      {showFilters && (
        <div className="bg-white/50 dark:bg-white/[0.01] border-b border-slate-200 dark:border-white/5 animate-in slide-in-from-top-4 duration-500">
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2 italic">
                <Settings2 size={14} /> Transmission
              </label>
              <div className="flex flex-wrap gap-2">
                {transmissions.map(t => (
                  <button key={t} onClick={() => setTransmission(t)}
                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${transmission === t ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>
                    {t === 'automatic' ? 'Automatique' : t === 'manual' ? 'Manuelle' : 'Tous'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2 italic">
                <Fuel size={14} /> Carburant
              </label>
              <div className="flex flex-wrap gap-2">
                {fuels.map(f => (
                  <button key={f} onClick={() => setFuel(f)}
                    className={`cursor-pointer px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${fuel === f ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/10' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>
                    {f === 'Tous' ? 'Tous' : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 italic">Budget Max / Jour</label>
                <span className="text-slate-900 dark:text-white font-black text-xs italic">{priceMax} MAD</span>
              </div>
              <input
                type="range" min={100} max={2000} step={50}
                value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>

            <div className="flex flex-col justify-end gap-5">
              <button
                onClick={resetFilters}
                className="group flex items-center justify-center gap-3 py-4 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic"
              >
                <X size={14} /> Réinitialiser les paramètres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. INVENTORY GRID */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-6">
          <div className="flex items-center gap-4">
              <div className="h-1 w-10 bg-orange-600 rounded-full"></div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-gray-500 italic">
                SÉLECTION PRÉCISION
              </p>
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-orange-500 cursor-pointer text-slate-600 dark:text-gray-400 italic outline-none"
          >
            <option value="default">Tri Intelligence</option>
            <option value="price-asc">Tarif Croissant</option>
            <option value="price-desc">Tarif Décroissant</option>
            <option value="rating">Top Performance</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-48 bg-white dark:bg-white/[0.02] rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-white/5">
            <Search size={64} className="text-slate-200 dark:text-gray-800 mx-auto mb-8" />
            <h3 className="text-3xl font-black text-slate-300 dark:text-gray-700 uppercase italic tracking-tighter">Machine Introuvable</h3>
            <p className="text-slate-400 text-xs font-bold mt-3 uppercase tracking-widest">Ajustez vos spécifications techniques.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filtered.map(car => (
              <div key={car.id} className="group bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-orange-500/50 rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(234,88,12,0.15)] flex flex-col relative">
                
                {/* Image Section */}
                <div className="relative h-60 overflow-hidden shrink-0">
                  <img src={car.image_url || '/placeholder-car.jpg'} alt={car.brand} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Glass Badges */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-orange-600 text-white text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-widest shadow-2xl italic">
                      {car.category?.toUpperCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <Star size={12} className="text-orange-500" fill="currentColor" />
                    <span className="text-xs font-black text-white">{car.rating || 4.8}</span>
                  </div>

                  {!car.is_available && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="border-2 border-red-500 text-red-500 text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-[0.3em] rotate-[-12deg]">Sortie</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none italic group-hover:text-orange-600 transition-colors">
                        {car.brand} <br /> 
                        <span className="text-slate-400 dark:text-gray-500 text-base not-italic tracking-normal">{car.model}</span>
                      </h3>
                      <span className="text-[10px] font-black text-orange-600 bg-orange-600/10 px-2 py-1 rounded">#{car.year || 2024}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 dark:text-gray-500">
                      <MapPin size={12} className="text-orange-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{car.agency_name || 'Casablanca'}</span>
                    </div>
                  </div>

                  {/* Tech Specs */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { icon: <Users size={14} />, label: `5 PL` }, // حيت مازال ما زدنا seats ف داتابيز درناها دي فولت
                      { icon: <Settings2 size={14} />, label: car.transmission === 'automatic' ? 'AUTO' : 'MANU' },
                      { icon: <Fuel size={14} />, label: car.fuel_type?.slice(0, 3).toUpperCase() || 'ESS' }
                    ].map((spec, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-white/5 py-4 rounded-[1.5rem] border border-slate-100 dark:border-white/5 flex flex-col items-center gap-2 group-hover:border-orange-500/20 transition-all">
                        <span className="text-slate-400 dark:text-orange-500/70">{spec.icon}</span>
                        <span className="text-[9px] font-black uppercase text-slate-600 dark:text-gray-400 tracking-tighter">{spec.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Action */}
                  <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tarif / Jour</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                        {car.price_per_day} <span className="text-[10px] text-orange-600 italic ml-1">MAD</span>
                      </p>
                    </div>
                    <Link 
                      to={`/car/${car.id}`} 
                      className="bg-slate-900 dark:bg-orange-600 hover:bg-orange-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-orange-600/30 group/btn"
                    >
                      <ArrowUpRight size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-500" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}