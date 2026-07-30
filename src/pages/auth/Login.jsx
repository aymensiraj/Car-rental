import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result?.pending) {
      navigate('/pending');
      return;
    }

    if (result?.success) {
      if (result.role === 'admin') navigate('/admin/dashboard');
      else if (result.role === 'agency') navigate('/agency/dashboard');
      else navigate('/');
    } else {
      setError(result?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6 transition-colors duration-500">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-slate-900 dark:bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <Car size={38} className="text-white dark:text-black" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Car <span className="text-orange-600 not-italic">Rental</span>
          </h1>
          <p className="text-slate-400 mt-3 text-[10px] font-black uppercase tracking-[0.3em]">Premium Rental Management</p>
        </div>

        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Connexion</h2>
              <ShieldCheck size={24} className="text-orange-600" />
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl px-5 py-4 mb-8 text-[11px] font-black uppercase tracking-wider">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Adresse Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600/50 transition-all font-bold text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mot de passe</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600/50 transition-all font-bold text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full cursor-pointer bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white font-black rounded-2xl py-5 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] uppercase text-[11px] tracking-[0.2em]">
                {loading
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><LogIn size={18} /> Accéder au Dashboard</>
                }
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Nouveau ici ?{' '}
                <Link to="/register" className="text-orange-600 hover:text-orange-500 transition-colors ml-1">Créer un compte</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}