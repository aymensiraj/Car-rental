import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-[#050505] pt-24 pb-12 overflow-hidden transition-colors duration-500 border-t dark:border-white/5">
      {/* Glow Effect f l-alwan dial Tuning */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/5 dark:bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-600/5 dark:bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* TOP PART */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 pb-16 border-b border-slate-200 dark:border-white/5">
          <div className="space-y-6">
             <div className="text-3xl font-black tracking-tighter italic text-slate-900 dark:text-white uppercase">
                CAR<span className="text-orange-600">.</span>RENTAL
            </div>
            <p className="text-slate-500 dark:text-gray-400 max-w-sm font-medium leading-relaxed">
              L'excellence du tuning et de la location premium à Casablanca. Libérez la puissance brute.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaXTwitter, FaLinkedinIn, FaFacebookF].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 transition-all shadow-sm">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight italic">Performance News</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 font-medium">Soyez le premier au courant de nos nouvelles configurations et stages moteur.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 py-5 px-6 rounded-2xl outline-none focus:border-orange-600 transition-all text-slate-900 dark:text-white font-medium"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 dark:bg-orange-600 text-white rounded-xl hover:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-orange-600/20">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* MIDDLE PART */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 mb-8 italic">Navigation</h4>
            <ul className="space-y-4">
              {['Accueil', 'Catalogue', 'Nos Services', 'À propos'].map(item => (
                <li key={item}><Link to="#" className="text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 mb-8 italic">Config</h4>
            <ul className="space-y-4">
              {['Stage 1', 'Stage 2', 'Esthétique', 'Échappement'].map(item => (
                <li key={item}><Link to="#" className="text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 mb-8 italic">Showroom</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-bold text-slate-500 dark:text-gray-400">
              <div className="flex items-start gap-3 italic">
                <MapPin size={20} className="text-orange-600 shrink-0" />
                <p>203 Boulevard d'Anfa, <br /> Casablanca, Maroc</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-orange-600" />
                  <p>+212 522 00 00 00</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-orange-600" />
                  <p>contact@autodrive.ma</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PART */}
        <div className="pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
            © 2026 CAR.RENTAL — RÉALISÉ PAR <span className="text-slate-900 dark:text-white underline decoration-orange-600 decoration-2 italic">AYMEN</span>
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">
            <a href="#" className="hover:text-orange-600 transition-colors">Politique</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Mentions</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}