import { Car, ArrowRight, ShieldCheck, Zap, Star, MapPin, Gauge, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 selection:bg-orange-600/30">
      
      {/* 1. HERO SECTION - Stealth Phantom Look */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Accents - Teal & Orange Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-cyan-900/10 dark:bg-cyan-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[50%] bg-orange-900/10 dark:bg-orange-600/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-12 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-gray-400">
                  Performance & Tuning
                </span>
              </div>
              
              <h1 className="text-6xl lg:text-[7.5rem] font-black leading-[0.9] tracking-tighter text-slate-950 dark:text-white uppercase">
                UNLOCK <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400">
                  POTENTIAL
                </span>
              </h1>

              <p className="text-slate-500 dark:text-gray-400 text-lg max-w-md mx-auto lg:mx-0 font-medium leading-relaxed border-l-2 border-orange-600 pl-6">
                Le tuning est une mise à niveau qui libère le potentiel caché de votre véhicule. L'élégance rencontre la puissance brute.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
                <Link 
                  to="/store" 
                  className="group bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-orange-600/20"
                >
                  Découvrir la flotte
                </Link>
                
                <button className="flex items-center gap-3 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest group">
                  <span className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-orange-600 transition-colors">
                    <Zap size={14} className="group-hover:text-orange-500 transition-colors" />
                  </span>
                  En savoir plus
                </button>
              </div>
            </div>

            {/* Right Side: Speedometer Style */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent blur-[100px] rounded-full opacity-20" />
              <img 
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop" 
                alt="Supercar" 
                className="relative z-10 w-full grayscale-[0.2] brightness-[0.8] group-hover:brightness-100 transition-all duration-700 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />
              
              {/* Performance Stats Overlay */}
              <div className="absolute -bottom-10 left-10 z-20 grid grid-cols-2 gap-4">
                <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white dark:border-white/10 shadow-2xl">
                  <p className="text-[9px] font-black text-orange-600 uppercase mb-1">Stage 1</p>
                  <p className="text-2xl font-black text-slate-950 dark:text-white leading-none">20-25 <span className="text-xs">hp</span></p>
                </div>
                <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white dark:border-white/10 shadow-2xl">
                  <p className="text-[9px] font-black text-orange-600 uppercase mb-1">Stage 2</p>
                  <p className="text-2xl font-black text-slate-950 dark:text-white leading-none">25-50 <span className="text-xs">hp</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFOS SECTION - Dark Minimalist */}
      <section className="py-32 bg-slate-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-4xl font-black text-slate-950 dark:text-white leading-tight uppercase italic">
                What is Tuning and Why do you Want It?
              </h2>
              <div className="w-12 h-1 bg-orange-600" />
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="text-orange-600"><Gauge size={32} /></div>
                <p className="text-slate-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                  Optimisation moteur pour une meilleure réponse à l'accélération et une montée en puissance fluide.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-orange-600"><Activity size={32} /></div>
                <p className="text-slate-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                  Réduction de la consommation de carburant grâce à une cartographie plus intelligente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CARDS SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Performance", icon: <Zap /> },
              { title: "Efficacité", icon: <Activity /> },
              { title: "Sécurité", icon: <ShieldCheck /> }
            ].map((item, i) => (
              <div key={i} className="group p-10 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl hover:bg-slate-950 dark:hover:bg-orange-600 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-orange-600/10 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-slate-950 dark:text-white group-hover:text-white uppercase mb-4 italic">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm group-hover:text-orange-50 transition-colors leading-relaxed">
                  Des modifications précises pour un comportement routier exceptionnel.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}