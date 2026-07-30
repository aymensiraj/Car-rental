import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, UserPlus, AlertCircle, ShieldCheck, Building2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const inputClass = "w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600/50 transition-all font-bold text-sm";

export default function Register() {
  const navigate = useNavigate();
  const { register, registerAgency } = useAuth();

  const [tab, setTab] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setError('');
    setForm({ name: '', email: '', password: '', password_confirmation: '' });
  };

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (tab === 'user') {
      const result = await register(form.name, form.email, form.password, form.password_confirmation);
      setLoading(false);
      if (result?.success) navigate('/');
      else setError(result?.message || 'Erreur');
    } else {
      const result = await registerAgency(form.name, form.email, form.password, form.password_confirmation);
      setLoading(false);
      if (result?.success) navigate('/pending');
      else setError(result?.message || 'Erreur');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6 transition-colors duration-500">
      <div className="w-full max-w-[440px]">

        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-slate-900 dark:bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <Car size={38} className="text-white dark:text-black" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Car <span className="text-orange-600 not-italic">Rental</span>
          </h1>
          <p className="text-slate-400 mt-3 text-[10px] font-black uppercase tracking-[0.3em]">Premium Rental Management</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 shadow-2xl">

          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1 mb-8 gap-1">
            <button type="button" onClick={() => handleTabChange('user')}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === 'user'
                  ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}>
              <User size={14} /> Client
            </button>
            <button type="button" onClick={() => handleTabChange('agency')}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === 'agency'
                  ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}>
              <Building2 size={14} /> Agence
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              {tab === 'user' ? 'Inscription' : 'Rejoindre'}
            </h2>
            <ShieldCheck size={24} className="text-orange-600" />
          </div>

          {/* Agency info */}
          {tab === 'agency' && (
            <div className="flex items-start gap-3 bg-orange-600/5 border border-orange-600/20 text-orange-600 rounded-2xl px-5 py-4 mb-6">
              <Building2 size={16} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-black uppercase tracking-wider leading-relaxed">
                Votre compte sera examiné par notre équipe avant activation. Confirmation sous 24h.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl px-5 py-4 mb-6 text-[11px] font-black uppercase tracking-wider">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                {tab === 'agency' ? "Nom de l'agence" : 'Nom complet'}
              </label>
              <input name="name" type="text" value={form.name} onChange={handleChange} required
                placeholder={tab === 'agency' ? 'Casa Motors Agency' : 'Aymen Siraj'}
                className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Adresse Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="nom@exemple.com" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mot de passe</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required placeholder="••••••••" className={inputClass} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Confirmer le mot de passe</label>
              <input name="password_confirmation" type="password" value={form.password_confirmation}
                onChange={handleChange} required placeholder="••••••••" className={inputClass} />
            </div>

            <button type="submit" disabled={loading}
              className="cursor-pointer w-full bg-slate-900 dark:bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl py-5 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] uppercase text-[11px] tracking-[0.2em] mt-4">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><UserPlus size={18} />{tab === 'agency' ? 'Soumettre ma demande' : 'Créer mon compte'}</>
              }
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-orange-600 hover:text-orange-500 font-black italic underline decoration-2 underline-offset-4">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}