import { useState, useEffect } from 'react';
import { Search, Trash2, CheckCircle, XCircle, Star, Building2, Car, Filter, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

// ==========================================
// SUB-COMPONENTS
// ==========================================
const Loader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center">
    <p className="text-orange-600 font-black italic animate-pulse tracking-widest">LOADING FLEET DATABASE...</p>
  </div>
);

const CarRow = ({ car, onDelete }) => (
  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
    <td className="px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${car.image}`} alt={car.brand} className="w-16 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-600 rounded-full border-2 border-white dark:border-gray-900"></div>
        </div>
        <div>
          <p className="font-black italic uppercase tracking-tighter text-lg">{car.brand} {car.model}</p>
          <p className="text-slate-400 dark:text-gray-500 font-bold italic uppercase text-[9px] tracking-widest">
            {car.transmission} • {car.fuel_type} • {car.seats} Seats
          </p>
        </div>
      </div>
    </td>
    <td className="px-8 py-5">
      <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 font-black italic uppercase text-xs">
        <Building2 size={14} className="text-orange-600" />
        {car.agency_name || "AutoDrive Agency"}
      </div>
    </td>
    <td className="px-8 py-5">
      <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 text-[10px] font-black italic uppercase px-3 py-1.5 rounded-lg tracking-widest border border-slate-200 dark:border-white/5">
        {car.category}
      </span>
    </td>
    <td className="px-8 py-5">
      <p className="text-orange-600 font-black italic text-lg tracking-tighter">{car.price_per_day} <span className="text-[10px] uppercase">Mad</span></p>
    </td>
 

    <td className="px-8 py-5 text-right">
      <button onClick={onDelete} className="p-3 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all duration-300">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function AdminCars() {
  const [search, setSearch] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [cars, setCars] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFleet = async () => {
      try {
        setLoading(true);
        const carsData = await adminService.getCarsFleet();
        const agenciesData = await adminService.getAgencies();
        setCars(carsData);
        setAgencies(agenciesData.active);
        setError('');
      } catch (err) {
        setError("Impossible de charger les véhicules depuis le serveur.");
      } finally {
        setLoading(false);
      }
    };
    loadFleet();
  }, []);

  const handleDeleteCar = async (id) => {
    try {
      await adminService.deleteCar(id);
      setCars(cars.filter(c => c.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      alert("Erreur lors de la suppression du véhicule.");
    }
  };

  const categories = ['all', ...Array.from(new Set(cars.map(c => c.category)))];

  const filtered = cars.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = c.brand?.toLowerCase().includes(q) || c.model?.toLowerCase().includes(q);
    const matchesAgency = selectedAgency === 'all' || String(c.user_id) === String(selectedAgency);
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesAgency && matchesCategory;
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold text-center">{error}</div>}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[2px] bg-orange-600"></div>
              <p className="text-orange-600 font-black italic uppercase tracking-[0.3em] text-[10px]">Fleet Management</p>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Car <span className="text-orange-600">Inventory</span></h1>
            <p className="text-slate-500 dark:text-gray-500 mt-3 font-bold italic uppercase text-xs tracking-widest">Total Assets: {cars.length} Vehicles.</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] shadow-sm mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[280px] group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input type="text" placeholder="Search by brand or model..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold italic focus:outline-none focus:border-orange-600 transition-all" />
            </div>
            
            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              <div className="relative">
                <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
                <select value={selectedAgency} onChange={e => setSelectedAgency(e.target.value)} className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-10 py-3.5 text-xs font-black italic uppercase tracking-wider appearance-none focus:outline-none focus:border-orange-600 cursor-pointer">
                  <option value="all">All Agencies</option>
                  {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div className="relative">
                <Car size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-10 py-3.5 text-xs font-black italic uppercase tracking-wider appearance-none cursor-pointer">
                  {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-500">
                  <th className="text-left px-8 py-5 text-[10px] font-black italic uppercase tracking-[0.2em]">Vehicle Details</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black italic uppercase tracking-[0.2em]">Provider</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black italic uppercase tracking-[0.2em]">Category</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black italic uppercase tracking-[0.2em]">Daily Rate</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black italic uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map(car => <CarRow key={car.id} car={car} onDelete={() => setConfirmDelete(car.id)} />)}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <Car size={48} className="opacity-10 mb-4" />
                <p className="font-black italic uppercase text-xs">Zero Vehicles Found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 max-w-md w-full">
            <AlertTriangle size={32} className="text-rose-500 mb-6" />
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Confirm <span className="text-rose-500">Deletion</span></h3>
            <p className="text-slate-500 dark:text-gray-400 font-bold italic text-sm mb-8 leading-relaxed">You are about to remove this asset from the fleet.</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-2xl py-4 text-xs font-black italic uppercase tracking-widest">Go Back</button>
              <button onClick={() => handleDeleteCar(confirmDelete)} className="flex-1 bg-rose-600 text-white rounded-2xl py-4 text-xs font-black italic uppercase tracking-widest shadow-lg shadow-rose-600/20">Delete Car</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}