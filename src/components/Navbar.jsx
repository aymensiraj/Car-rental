import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Car, ShoppingCart, User, LogOut, Menu, X, 
  Sun, Moon, LogIn 
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { currentUser, currentRole, logout } = useAuth();
  const { cart } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/home');
    setMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path 
      ? 'text-orange-600 dark:text-orange-500 font-bold italic border-b-2 border-orange-600' 
      : 'text-slate-600 dark:text-gray-400 hover:text-orange-600 transition-colors';

  return (
    <nav className="bg-white/90 dark:bg-black/95 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Car size={22} className="text-white" />
            </div>
            <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter hidden sm:block italic uppercase">
              CarRental
            </span>
          </Link>

          
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-black italic">
            
            
            {(!currentRole || currentRole === 'user') && (
              <>
                <Link to="/home" className={isActive('/home')}>Accueil</Link>
                <Link to="/store" className={isActive('/store')}>Catalogue</Link>
              </>
            )}

            
            {currentRole === 'user' && (
              <>
              <Link to="/my-orders" className={isActive('/my-orders')}>Mes Commandes</Link>
              </>
            )}

          
            {currentRole === 'admin' && (
              <>
                <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
                <Link to="/admin/cars" className={isActive('/admin/cars')}>Gestion Voitures</Link>
                <Link to="/admin/accounts" className={isActive('/admin/accounts')}>Comptes</Link>
              </>
            )}

           
            {currentRole === 'agency' && (
              <>
                <Link to="/agency/dashboard" className={isActive('/agency/dashboard')}>Dashboard</Link>
                <Link to="/agency/cars" className={isActive('/agency/cars')}>Ma Flotte</Link>
                <Link to="/agency/orders" className={isActive('/agency/orders')}>Réservations</Link>
               
              </>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            
            <button 
              onClick={toggleTheme}
              className="cursor-pointer p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:bg-orange-600 hover:text-white transition-all shadow-inner"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            
            {(!currentRole || currentRole === 'user') && (
              <Link to="/cart" className="relative p-2.5 text-slate-500 dark:text-gray-400 hover:text-orange-600 transition-colors">
                <ShoppingCart size={22} />
                {cart?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black border-2 border-white dark:border-black">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

           
            {currentUser ? (
              <>
               
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-100 dark:border-white/10">
                  <div className="text-right hidden lg:block">
                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic leading-none">{currentUser?.name}</p>
                    <p className="text-[8px] font-bold text-orange-600 uppercase tracking-[0.1em] mt-1">{currentRole}</p>
                  </div>
                  {
                    currentRole === 'user' && (
                      <Link to="/my-profile" className={isActive('/my-profile')}>
                        <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10">
                          <User size={18} className="text-slate-600 dark:text-gray-300" />
                        </div>
                      </Link>
                    )
                  }
                  {
                    currentRole === 'agency' && (
                      <Link to="/agency/profile" className={isActive('/agency/profile')}>
                        <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10">
                          <User size={18} className="text-slate-600 dark:text-gray-300" />
                        </div>
                      </Link>
                    )
                  }
                </div>

               
                <button
                  onClick={handleLogout}
                  className="cursor-pointer hidden md:flex p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
           
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-slate-900 dark:bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md"
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">Connexion</span>
              </Link>
            )}

            
            <button 
              className="md:hidden p-2 text-slate-600 dark:text-gray-300" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

     
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-slate-100 dark:border-white/10 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top">
          <div className="flex flex-col gap-4 text-[14px] font-black uppercase tracking-widest italic">
            
           
            {(!currentRole || currentRole === 'user') && (
              <>
                <Link to="/" onClick={() => setMenuOpen(false)} className={isActive('/home')}>Accueil</Link>
                <Link to="/store" onClick={() => setMenuOpen(false)} className={isActive('/store')}>Catalogue</Link>
              </>
            )}

    
            {currentRole === 'user' && (
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className={isActive('/my-orders')}>Mes Commandes</Link>
            )}

           
            {currentRole === 'admin' && (
              <>
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className={isActive('/admin/dashboard')}>Dashboard</Link>
                <Link to="/admin/cars" onClick={() => setMenuOpen(false)} className={isActive('/admin/cars')}>Voitures</Link>
                <Link to="/admin/accounts" onClick={() => setMenuOpen(false)} className={isActive('/admin/accounts')}>Comptes</Link>
                <Link to="/admin/create-agency" onClick={() => setMenuOpen(false)} className={isActive('/admin/create-agency')}>+ Agence</Link>
              </>
            )}

          
            {currentRole === 'agency' && (
              <>
                <Link to="/agency/dashboard" onClick={() => setMenuOpen(false)} className={isActive('/agency/dashboard')}>Stats</Link>
                <Link to="/agency/cars" onClick={() => setMenuOpen(false)} className={isActive('/agency/cars')}>Flotte</Link>
                <Link to="/agency/orders" onClick={() => setMenuOpen(false)} className={isActive('/agency/orders')}>Commandes</Link>
              </>
            )}
          </div>

          {currentUser ? (
            <button 
              onClick={handleLogout} 
              className="flex cursor-pointer items-center gap-3 text-red-500 font-black uppercase tracking-widest pt-6 border-t border-slate-100 dark:border-white/10 italic"
            >
                <span>Déconnexion</span>
              <LogOut size={20} className="cursor-pointer" />
            </button>
          ) : (
            <Link 
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex justify-center items-center gap-2 bg-orange-600 text-white font-black uppercase tracking-widest py-4 rounded-xl italic text-xs"
            >
              <LogIn size={16} /> Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}