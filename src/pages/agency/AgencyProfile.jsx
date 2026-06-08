import { useState, useEffect } from 'react';
import { Save, Building2, Phone, MapPin, Star, Car, ClipboardList, Mail, CalendarDays, Zap, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
export default function AgencyProfile() {
  // كنجيبو الداتا و دالة التحديث من الـ Context
  const { currentUser, setCurrentUser } = useAuth();
  const { cars, orders } = useApp();

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }
};
  const agency = currentUser || {};
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    logo: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 هنا كنعمروا الـ Form بالداتا الحقيقية اللي جاية مفرقة بين الـ User والـ Profile
  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || '',
        phone: currentUser.profile?.phone || '',
        address: currentUser.profile?.address || '',
        city: currentUser.profile?.city || '',
        logo: currentUser.profile?.logo || '',
      });
    }
  }, [currentUser]);

  const agencyCars = (cars || []).filter(c => c.agency_name === agency.name || c.agencyId === agency.id);
  const agencyOrders = (orders || []).filter(o => o.agency_name === agency.name || o.agencyId === agency.id);
  
  const revenue = (orders || [])
    .filter(o => o.status === 'accepted' || o.status === 'completed' || o.status === 'Payé')
    .reduce((s, o) => s + (Number(o.total_price) || Number(o.totalPrice) || 0), 0);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSaved(false);

      try {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phone', form.phone || '');
        formData.append('city', form.city || '');
        formData.append('address', form.address || '');


        if (logoFile instanceof File) {
          formData.append('logo', logoFile);
        }

        const data = await profileService.updateProfile(formData);

        if (setCurrentUser && data.user) {
          setCurrentUser(data.user);
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        console.error("Validation errors:", err.response?.data?.errors); // ✅ زيد هاد السطر
        setError(err.response?.data?.message || "Impossible de mettre à jour le profil.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
            <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] italic">Agency Control</p>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
            Public <span className="text-orange-600">Profile</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-4 font-bold italic uppercase text-xs tracking-widest">
            Manage your brand identity and system presence
          </p>
        </div>

        {/* Error Alert display */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-2xl font-bold text-xs uppercase italic tracking-wider border border-red-200 dark:border-red-900/50">
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* Stats & Identity Panel (Left) */}
          <div className="xl:col-span-1 space-y-8">
            
            {/* Identity Card */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Building2 size={80} className="text-slate-900 dark:text-white" />
              </div>
              
              <div className="relative inline-block mb-6">
                <img 
                  src={form.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'Agency')}&background=ea580c&color=fff&size=128`}
                  alt="Agency logo"
                  className="w-32 h-32 rounded-[2rem] mx-auto object-cover border-4 border-white dark:border-gray-900 shadow-2xl relative z-10" 
                />
                <div className="absolute inset-0 bg-orange-600 blur-2xl opacity-20 -z-0" />
              </div>

              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2 truncate">
                {form.name || agency.name}
              </h2>
              
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-gray-400 font-black italic uppercase text-[10px] tracking-widest mb-6">
                <MapPin size={12} className="text-orange-600" /> {form.city || 'Location Pending'}
              </div>

              <div className="inline-flex items-center gap-3 bg-white dark:bg-white/5 px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <Star size={16} className="text-orange-600" fill="currentColor" />
                <span className="text-slate-990 dark:text-white font-black italic text-xl">{agency.rating || '4.7'}</span>
                <span className="text-slate-400 font-bold text-xs uppercase italic tracking-widest">Global Score</span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8">
              <h3 className="text-slate-900 dark:text-white font-black italic uppercase text-xs tracking-widest mb-8 flex items-center gap-2">
                <Zap size={14} className="text-orange-600" /> Core Performance
              </h3>
              
              <div className="space-y-6">
                {[
                  { icon: Car, label: 'Fleet Units', value: agencyCars.length, color: 'text-blue-500' },
                  { icon: ClipboardList, label: 'Bookings', value: agencyOrders.length, color: 'text-purple-500' },
                  { icon: Star, label: 'Gross Revenue', value: `${revenue.toLocaleString()} MAD`, color: 'text-green-500' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-gray-400">
                      <div className={`p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 ${stat.color}`}>
                        <stat.icon size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase italic tracking-widest">{stat.label}</span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-black italic text-sm tracking-tight">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="bg-slate-900 dark:bg-orange-600/10 border border-slate-800 dark:border-orange-600/20 rounded-[2.5rem] p-8 text-white">
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 dark:text-orange-600/60 text-[8px] font-black uppercase tracking-[0.3em] italic mb-1">Registration Date</p>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-orange-600" />
                    <span className="font-black italic uppercase text-xs tracking-tighter">
                      {agency.created_at ? new Date(agency.created_at).toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'}) : 'JANUARY 2026'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-orange-600/60 text-[8px] font-black uppercase tracking-[0.3em] italic mb-1">System Liaison</p>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-orange-600" />
                    <span className="font-black italic text-xs tracking-tighter truncate">{agency.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Form (Right) */}
          <div className="xl:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <h3 className="text-slate-900 dark:text-white font-black text-2xl italic tracking-tighter uppercase mb-10 pb-6 border-b border-slate-200 dark:border-white/5 flex items-center gap-3">
                <Building2 className="text-orange-600" /> Identity <span className="text-orange-600">Config</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: 'name', label: "Legal Agency Name", icon: Building2, placeholder: 'Ex: AutoDrive Casablanca' },
                  { name: 'phone', label: 'Liaison Phone', icon: Phone, placeholder: '+212 ...' },
                  { name: 'city', label: 'Primary City', icon: MapPin, placeholder: 'Ex: Casablanca' },
                ].map(f => (
                  <div key={f.name} className="space-y-2">
                    <label className="text-slate-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest italic ml-1">{f.label}</label>
                    <div className="relative group">
                      <f.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                      <input
                        name={f.name}
                        type="text"
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required={f.name === 'name'} // الاسم ضروري ف السيستيم
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-orange-600 text-xs font-bold italic transition-all"
                      />
                    </div>
                  </div>
                ))}
                
                {/* Full Width Address */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-slate-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest italic ml-1">HQ Address</label>
                  <div className="relative group">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                    <input
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Ex: Boulevard Zerktouni, No. 42"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-orange-600 text-xs font-bold italic transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Preview Section */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-slate-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest italic ml-1">
                  Brand Logo
                </label>
                <label className="block cursor-pointer group">
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 hover:border-orange-500 transition-all">
                    {/* Preview */}
                    <img
                      src={logoPreview || form.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'A')}&background=ea580c&color=fff&size=64`}
                      alt="logo preview"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                    />
                    <div>
                      <p className="text-xs font-black italic uppercase text-slate-500">
                        {logoFile ? logoFile.name : 'Click to upload logo'}
                      </p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                        JPG, PNG, WEBP — max 2MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-12">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`cursor-pointer w-full font-black italic uppercase text-xs tracking-[0.2em] py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl ${
                    saved 
                    ? 'bg-green-600 text-white shadow-green-600/20' 
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/20'
                  }`}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : saved ? (
                    <>CONFIRMED ✓ SYSTEM UPDATED</>
                  ) : (
                    <>
                      <Save size={18} strokeWidth={3} /> Commit Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}