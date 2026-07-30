import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Car, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { carService } from '../../services/carService.js'; 
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Économique', 'SUV', 'Luxe', 'Électrique'];
const TRANSMISSIONS = ['Automatique', 'Manuelle'];
const FUELS = ['Essence', 'Diesel', 'Électrique', 'Hybride'];
const COLORS = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Beige', 'Vert', 'Argent'];

const IMAGE_BASE_URL = 'http://localhost:8000/storage/'; 

const defaultForm = {
  brand: '', model: '', year: 2024, category: 'Économique',
  price: 300, image: null, color: 'Blanc', seats: 5,
  transmission: 'Manuelle', fuel: 'Essence',
  mileage: 0, available: true, description: '', features: '',
};

export default function AgencyUpdateCarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [form, setForm] = useState(defaultForm);
  const [preview, setPreview] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const response = await carService.getCar(id); 
        
        const car = response.car ? response.car : response; 
        
        const reverseCategoryMap = { 'economique': 'Économique', 'suv': 'SUV', 'luxe': 'Luxe', 'electrique': 'Électrique' };
        const reverseTransmissionMap = { 'manual': 'Manuelle', 'automatic': 'Automatique' };
        const reverseFuelMap = { 'essence': 'Essence', 'diesel': 'Diesel', 'electric': 'Électrique', 'hybride': 'Hybride' };

        setForm({
          brand: car.brand || '',
          model: car.model || '',
          year: car.year || 2024,
          category: reverseCategoryMap[car.category] || 'Économique',
          price: car.price_per_day || 300,
          image: car.image || null,
          color: car.color || 'Blanc',
          seats: car.seats || 5,
          transmission: reverseTransmissionMap[car.transmission] || 'Manuelle',
          fuel: reverseFuelMap[car.fuel_type] || 'Essence', 
          mileage: car.mileage || 0,
          available: car.is_available === 1 || car.is_available === true,
          description: car.description || '',
          features: Array.isArray(car.features) ? car.features.join(', ') : car.features || '',
        });

        if (car.image && typeof car.image === 'string') {
          const fullImageUrl = car.image.startsWith('http') ? car.image : `${IMAGE_BASE_URL}${car.image}`;
          setPreview(fullImageUrl); 
        }
      } catch (error) {
        // Car data fetch failed
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setForm(prev => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file)); 
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked
          : ['year', 'price', 'seats', 'mileage'].includes(name) ? Number(value)
          : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);

    const formData = new FormData();
    
    formData.append('_method', 'PUT');  
    
    formData.append('brand', form.brand);
    formData.append('model', form.model);
    formData.append('year', Number(form.year));
    formData.append('seats', Number(form.seats));
    formData.append('mileage', Number(form.mileage));
    formData.append('color', form.color);
    
    formData.append('price_per_day', Number(form.price)); 

    const categoryMap = { 'Économique': 'economique', 'SUV': 'suv', 'Luxe': 'luxe', 'Électrique': 'electrique' };
    formData.append('category', categoryMap[form.category] || 'economique');

    const transmissionMap = { 'Manuelle': 'manual', 'Automatique': 'automatic' };
    formData.append('transmission', transmissionMap[form.transmission] || 'manual');

    const fuelMap = { 'Essence': 'essence', 'Diesel': 'diesel', 'Électrique': 'electric', 'Hybride': 'hybride' };
    formData.append('fuel_type', fuelMap[form.fuel] || 'essence'); 

    formData.append('city', currentUser?.city || 'Casablanca'); 
    formData.append('agency_name', currentUser?.name || 'AutoDrive Agency');

    formData.append('is_available', form.available ? 1 : 0);
    formData.append('description', form.description || '');
    formData.append('features', form.features || '');

    if (form.image instanceof File) {
      formData.append('image', form.image);
    }

    try {
      setLoading(true);
      await carService.updateCar(id, formData);
      setSaved(true);
      setTimeout(() => navigate('/agency/cars'), 1200);
    } catch (error) {
      // Car update failed
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-300 font-bold italic uppercase text-xs";
  const labelStyle = "text-slate-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 italic";

  if (loading && !saved) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              type="button"
              onClick={() => navigate('/agency/cars')} 
              className="group flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-orange-600 mb-4 transition-all"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Garage</span>
            </button>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
              Update <span className="text-orange-600">Potential</span>
            </h1>
          </div>
          
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 backdrop-blur-xl relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-10 border-l-4 border-orange-600 pl-4">
                <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white/90">Car Configuration</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Brand Name</label>
                  <input name="brand" type="text" value={form.brand} onChange={handleChange} required className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Model Spec</label>
                  <input name="model" type="text" value={form.model} onChange={handleChange} required className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Production Year</label>
                  <input name="year" type="number" value={form.year} onChange={handleChange} required className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Daily Rate (MAD)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required className={inputStyle} />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-white/10">
                <div>
                  <label className={labelStyle}>Mileage (KM)</label>
                  <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Total Seats</label>
                  <input name="seats" type="number" value={form.seats} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Color</label>
                  <select name="color" value={form.color} onChange={handleChange} className={inputStyle}>
                    {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
               <label className={labelStyle}>Features / Options</label>
               <input name="features" type="text" value={form.features} onChange={handleChange} placeholder="ex: GPS, Carplay" className={inputStyle} />
            </div>

            <div>
               <label className={labelStyle}>Technical Description</label>
               <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`${inputStyle} normal-case h-32`} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-center">
              <label className={labelStyle}>Visual Identity</label>
              <label className="block cursor-pointer group">
                <div className="aspect-video rounded-2xl bg-slate-200 dark:bg-black/50 overflow-hidden mb-4 relative border border-slate-300 dark:border-white/10 flex items-center justify-center hover:border-orange-500 transition-all">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Camera className="text-slate-400" size={28} />
                      <span className="text-[9px] font-black uppercase text-slate-400">Upload Photo</span>
                    </div>
                  )}
                </div>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 space-y-6">
              <div>
                <label className={labelStyle}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Transmission</label>
                <select name="transmission" value={form.transmission} onChange={handleChange} className={inputStyle}>
                  {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Fuel Type</label>
                <select name="fuel" value={form.fuel} onChange={handleChange} className={inputStyle}>
                  {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              
              <div className="pt-4">
                <label className="flex items-center gap-4 cursor-pointer group bg-white dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                  <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="w-5 h-5 accent-orange-600" />
                  <span className="text-[10px] font-black uppercase italic text-slate-500">Available Now</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={saved} className={`cursor-pointer w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all ${saved ? 'bg-green-600' : 'bg-orange-600 hover:scale-[1.02]'}`}>
              {saved ? <CheckCircle2 size={24} className="text-white" /> : <><Save size={20} className="text-white" /><span className="text-white font-black uppercase tracking-wider text-sm">Save Changes</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}