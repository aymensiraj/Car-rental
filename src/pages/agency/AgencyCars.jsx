import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Car, Loader2 } from 'lucide-react';
import { carService } from '../../services/carService'; 

const getCarImage = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x250?text=No+Image';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  return `http://localhost:8000/storage/${imagePath}`;
};

export default function AgencyCars() {
  const [agencyCars, setAgencyCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await carService.getAgencyCars();
      // Handle both direct array and nested data.cars response from backend
      setAgencyCars(Array.isArray(data) ? data : data.cars || []);
    } catch (error) {
      setAgencyCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    try {
      await carService.deleteCar(id);
      setAgencyCars(prev => prev.filter(car => car.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      // Error handled silently
    }
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
              <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] italic">Fleet Management</p>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
              Garage <span className="text-orange-600">Inventory</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-4 font-bold italic uppercase text-xs tracking-widest">
              {agencyCars.length} high-performance vehicles registered
            </p>
          </div>
          
          <Link 
            to="/agency/cars/add" 
            className="group px-8 py-4 bg-orange-600 text-white rounded-2xl font-black italic uppercase text-xs tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 flex items-center gap-3"
          >
            <Plus size={18} strokeWidth={3} /> Add New Beast
          </Link>
        </div>

        {agencyCars.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
            <div className="bg-white dark:bg-gray-900 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Car size={40} className="text-orange-600" />
            </div>
            <p className="text-slate-900 dark:text-white text-2xl font-black italic uppercase tracking-tighter mb-2">Garage is empty</p>
            <Link to="/agency/cars/add" className="text-orange-600 font-black italic uppercase text-xs border-b-2 border-orange-600 pb-1">
              Register First Vehicle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {agencyCars.map(car => (
              <div key={car.id} className="group bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:border-orange-600/50 transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={getCarImage(car.image)} 
                    alt={car.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase italic px-4 py-1.5 rounded-lg tracking-widest">{car.category}</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-900 dark:text-white font-black text-2xl italic tracking-tighter uppercase">{car.brand} <span className="text-orange-600">{car.model}</span></h3>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white italic">{car.price_per_day} <span className="text-xs text-orange-600">MAD</span></span>
                    
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmDelete(car.id)} className="cursor-pointer bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={18} />
                      </button>
                      <Link to={`/agency/cars/edit/${car.id}`} className="cursor-pointer bg-orange-500/10 border border-orange-500/20 text-orange-500 p-3 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                        <Edit2 size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center">
            <h3 className="text-2xl font-black italic uppercase mb-6">Confirm Deletion?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setConfirmDelete(null)} className="py-4 bg-slate-100 rounded-2xl">Abort</button>
              <button onClick={() => handleDelete(confirmDelete)} className="py-4 bg-red-600 text-white rounded-2xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}