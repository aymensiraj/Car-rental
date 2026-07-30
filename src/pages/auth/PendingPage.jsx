import { Clock, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] text-center">
        <div className="w-24 h-24 bg-orange-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-orange-600/20">
          <Clock size={44} className="text-orange-600" />
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-4">
          En <span className="text-orange-600">Attente</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 font-bold uppercase text-xs tracking-[0.3em] mb-8 leading-relaxed">
          Votre demande d'agence a été soumise avec succès.<br />
          Notre équipe va examiner votre dossier sous 24h.
        </p>
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 mb-8">
          <Mail size={24} className="text-orange-600 mx-auto mb-4" />
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Vous serez notifié par email dès que votre compte sera activé.
          </p>
        </div>
        <Link to="/login"
          className="inline-flex items-center gap-3 text-slate-400 hover:text-orange-600 transition-colors font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>
      </div>
    </div>
  );
}