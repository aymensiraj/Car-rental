import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Home, Camera, Save, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';

const IMAGE_BASE_URL = 'http://localhost:8000/storage/';

const inputStyle = "w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-300 font-bold italic uppercase text-xs";
const labelStyle = "text-slate-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 italic";

export default function UserProfile() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    logo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // ملا الـ form من الـ currentUser
  useEffect(() => {
    if (currentUser) {
      const profile = currentUser.profile || {};
      setForm({
        name: currentUser.name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        address: profile.address || '',
        logo: null,
      });

      if (profile.logo) {
        const logoUrl = profile.logo.startsWith('http')
          ? profile.logo
          : `${IMAGE_BASE_URL}${profile.logo}`;
        setPreview(logoUrl);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setForm(prev => ({ ...prev, logo: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone || '');
      formData.append('city', form.city || '');
      formData.append('address', form.address || '');
      if (form.logo instanceof File) {
        formData.append('logo', form.logo);
      }

      const response = await profileService.updateProfile(formData);

      if (response?.user) {
        setCurrentUser(response.user);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !saved) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-orange-600 mb-4 transition-all"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Retour</span>
            </button>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-1 w-10 bg-orange-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 italic">Mon Compte</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
              Mon <span className="text-orange-600">Profil</span>
            </h1>
          </div>

          {/* Avatar preview */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-orange-600/10 flex items-center justify-center border border-orange-600/20">
              {preview
                ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                : <User size={26} className="text-orange-600" />
              }
            </div>
            <div>
              <p className="text-[9px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Connecté en tant que</p>
              <p className="text-sm font-black dark:text-white uppercase italic tracking-tighter">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Champs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-8 border-l-4 border-orange-600 pl-4">
                <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Informations Personnelles</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className={labelStyle}>Nom complet</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
                    <input name="name" type="text" value={form.name} onChange={handleChange} required
                      className={`${inputStyle} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Téléphone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
                    <input name="phone" type="text" value={form.phone} onChange={handleChange}
                      placeholder="06 XX XX XX XX"
                      className={`${inputStyle} pl-10`} />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Ville</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
                    <input name="city" type="text" value={form.city} onChange={handleChange}
                      placeholder="Casablanca"
                      className={`${inputStyle} pl-10`} />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelStyle}>Adresse</label>
                  <div className="relative">
                    <Home size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
                    <input name="address" type="text" value={form.address} onChange={handleChange}
                      placeholder="Rue, Quartier..."
                      className={`${inputStyle} pl-10`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Email (read only) */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-6 border-l-4 border-slate-300 dark:border-white/20 pl-4">
                <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Sécurité</h2>
              </div>
              <div>
                <label className={labelStyle}>Adresse Email</label>
                <input type="email" value={currentUser?.email || ''} disabled
                  className={`${inputStyle} opacity-50 cursor-not-allowed`} />
                <p className="text-[9px] text-slate-400 mt-2 ml-1 font-bold uppercase tracking-wider italic">
                  L'email ne peut pas être modifié
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Photo */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-center">
              <label className={labelStyle}>Photo de profil</label>
              <label className="block cursor-pointer group">
                <div className="aspect-square rounded-2xl bg-slate-200 dark:bg-black/50 overflow-hidden mb-4 relative border border-slate-300 dark:border-white/10 flex items-center justify-center hover:border-orange-500 transition-all">
                  {preview
                    ? <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    : (
                      <div className="flex flex-col items-center justify-center gap-3 p-8">
                        <Camera className="text-slate-400" size={32} />
                        <span className="text-[9px] font-black uppercase text-slate-400">Changer photo</span>
                      </div>
                    )
                  }
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Camera size={28} className="text-white" />
                  </div>
                </div>
                <input type="file" name="logo" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider italic">
                JPG, PNG ou WEBP · Max 2MB
              </p>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={loading || saved}
              className={`cursor-pointer w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-wider text-sm shadow-xl ${
                saved
                  ? 'bg-green-600 shadow-green-600/20'
                  : 'bg-orange-600 hover:bg-orange-700 hover:scale-[1.02] shadow-orange-600/20'
              }`}
            >
              {saved
                ? <><CheckCircle2 size={22} className="text-white" /><span className="text-white">Sauvegardé !</span></>
                : loading
                ? <Loader2 size={22} className="text-white animate-spin" />
                : <><Save size={20} className="text-white" /><span className="text-white">Enregistrer</span></>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}