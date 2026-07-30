import { useState, useEffect } from 'react';
import { Users, Building2, Trash2, Search, Calendar, ShieldCheck, Zap } from 'lucide-react';
import adminService from '../../services/adminService';

const Loader = () => (
  <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
    <p className="text-orange-600 font-black italic animate-pulse tracking-widest">LOADING DATABASE...</p>
  </div>
);

const UserRow = ({ user, onDelete }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        {user.profile?.logo ? (
          <img
            src={user.profile.logo.startsWith('http') ? user.profile.logo : `http://localhost:8000/storage/${user.profile.logo}`}
            alt={user.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-md"
          />
        ) : (
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black italic text-lg shadow-lg shadow-orange-600/20 group-hover:rotate-6 transition-transform">
            {user.name?.charAt(0) || 'U'}
          </div>
        )}
        <div>
          <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-tighter text-sm">{user.name}</p>
          <span className="flex items-center gap-1 text-orange-600 text-[10px] font-black uppercase tracking-widest italic">
            <ShieldCheck size={10} /> Verified Client
          </span>
        </div>
      </div>
    </td>
    <td className="px-8 py-6">
      <p className="text-slate-600 dark:text-gray-300 font-bold text-xs">{user.email}</p>
      <p className="text-slate-400 dark:text-gray-500 text-[10px] font-medium mt-1">{user.profile?.address || 'No address set'}</p>
    </td>
    <td className="px-8 py-6">
      <span className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-[10px] font-black italic uppercase tracking-widest">
        <Calendar size={12} className="text-orange-600" />
        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
      </span>
    </td>
    <td className="px-8 py-6 text-center">
      <button onClick={onDelete} className="cursor-pointer p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-90">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

const AgencyRow = ({ agency, onDelete }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        {agency.profile?.logo ? (
          <img
            src={agency.profile.logo?.startsWith('http') ? agency.profile.logo : `http://localhost:8000/storage/${agency.profile.logo}`}
            alt={agency.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-md group-hover:-rotate-3 transition-transform"
          />
        ) : (
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black italic text-lg shadow-lg">
            {agency.name?.charAt(0) || 'A'}
          </div>
        )}
        <div>
          <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-tighter text-sm">{agency.name}</p>
          <span className="bg-orange-600/10 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded italic tracking-[0.1em] uppercase">Partner</span>
        </div>
      </div>
    </td>
    <td className="px-8 py-6 text-slate-600 dark:text-gray-300">
      <p className="font-black italic text-xs uppercase tracking-widest">{agency.profile?.city || 'N/A'}</p>
      <p className="text-[10px] text-slate-400 mt-1">{agency.email}</p>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-yellow-500" fill="currentColor" />
        <span className="font-black italic text-sm text-slate-900 dark:text-white">5.0</span>
      </div>
    </td>
    <td className="px-8 py-6 text-center">
      <button onClick={onDelete} className="cursor-pointer p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-90">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

const PendingAgencyRow = ({ agency, onApprove, onReject }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-600/10 border border-orange-600/20 rounded-2xl flex items-center justify-center text-orange-600 font-black italic text-lg">
          {agency.name?.charAt(0) || 'A'}
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-tighter text-sm">{agency.name}</p>
          <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-2 py-0.5 rounded italic tracking-[0.1em] uppercase">En attente</span>
        </div>
      </div>
    </td>
    <td className="px-8 py-6">
      <p className="text-slate-600 dark:text-gray-300 font-bold text-xs">{agency.email}</p>
      <p className="text-slate-400 text-[10px] mt-1">{agency.created_at ? new Date(agency.created_at).toLocaleDateString() : 'N/A'}</p>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-3">
        <button onClick={onApprove}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-wider">
          <ShieldCheck size={14} /> Approuver
        </button>
        <button onClick={onReject}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-wider">
          <Trash2 size={14} /> Rejeter
        </button>
      </div>
    </td>
  </tr>
);

export default function AdminAccounts() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [pendingAgencies, setPendingAgencies] = useState([]);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const usersData    = await adminService.getUsers();
        const agenciesData = await adminService.getAgencies();
        setUsers(usersData);
        setAgencies(agenciesData.active);
        setPendingAgencies(agenciesData.pending);
      } catch (err) {
        // Failed to load data
        setError("Impossible de charger les données depuis le serveur.");
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveAgency(id);
      const approved = pendingAgencies.find(a => a.id === id);
      setPendingAgencies(prev => prev.filter(a => a.id !== id));
      setAgencies(prev => [...prev, { ...approved, status: 'active' }]);
    } catch {
      alert("Erreur lors de l'approbation.");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectAgency(id);
      setPendingAgencies(prev => prev.filter(a => a.id !== id));
    } catch {
      alert("Erreur lors du rejet.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteAccount(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setAgencies(prev => prev.filter(a => a.id !== id));
      setConfirmDelete(null);
    } catch {
      alert("Erreur lors de la suppression du compte.");
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAgencies = agencies.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const currentList = tab === 'users' ? filteredUsers : tab === 'agencies' ? filteredAgencies : pendingAgencies;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold text-center">{error}</div>}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
              <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] italic">Root Terminal</p>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
              Account <span className="text-orange-600">Control</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-4 font-bold italic uppercase text-xs tracking-widest">
              {users.length} active users • {agencies.length} registered partners
            </p>
          </div>
          <div className="relative group w-full max-w-sm">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <input type="text" placeholder="QUICK SEARCH..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 font-black italic text-xs tracking-widest focus:outline-none focus:border-orange-600 transition-all shadow-sm" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] mb-10 w-fit gap-1">
          {[
            { key: 'users', label: 'Users', icon: <Users size={16} strokeWidth={3} /> },
            { key: 'agencies', label: 'Agencies', icon: <Building2 size={16} strokeWidth={3} /> },
            { key: 'pending', label: 'Pending', icon: <ShieldCheck size={16} strokeWidth={3} /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex cursor-pointer items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black italic text-xs tracking-[0.15em] uppercase transition-all ${
                tab === t.key ? 'bg-white dark:bg-orange-600 text-slate-900 dark:text-white shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}>
              {t.icon} {t.label}
              {t.key === 'pending' && pendingAgencies.length > 0 && (
                <span className="bg-orange-600 dark:bg-white text-white dark:text-orange-600 text-[9px] font-black px-2 py-0.5 rounded-full">
                  {pendingAgencies.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  {tab === 'pending' ? (
                    <>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Agence</th>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Contact</th>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Actions</th>
                    </>
                  ) : tab === 'users' ? (
                    <>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Identity</th>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Contact/Location</th>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Registry</th>
                      <th className="text-center px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Action</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Partner</th>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Regional Data</th>
                      <th className="text-left px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Performance</th>
                      <th className="text-center px-8 py-6 font-black italic uppercase text-[10px] tracking-[0.2em] text-slate-400">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {tab === 'users'
                  ? filteredUsers.map(user => <UserRow key={user.id} user={user} onDelete={() => setConfirmDelete(user.id)} />)
                  : tab === 'agencies'
                  ? filteredAgencies.map(agency => <AgencyRow key={agency.id} agency={agency} onDelete={() => setConfirmDelete(agency.id)} />)
                  : pendingAgencies.map(agency => (
                      <PendingAgencyRow key={agency.id} agency={agency}
                        onApprove={() => handleApprove(agency.id)}
                        onReject={() => handleReject(agency.id)}
                      />
                    ))
                }
              </tbody>
            </table>

            {currentList.length === 0 && (
              <div className="py-24 text-center">
                <Search size={40} className="text-slate-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-slate-400 font-black italic uppercase text-xs tracking-[0.2em]">No records found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 max-w-sm w-full text-center">
            <Trash2 size={32} className="text-red-500 mx-auto mb-6" />
            <h3 className="text-slate-900 dark:text-white font-black italic text-2xl uppercase mb-4">Wipe Account?</h3>
            <p className="text-slate-500 dark:text-gray-400 font-bold italic text-xs uppercase mb-8 leading-relaxed">This action will permanently delete this record.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="cursor-pointer w-full bg-red-500 text-white font-black italic uppercase text-xs py-5 rounded-2xl shadow-xl shadow-red-500/20 active:scale-95">Confirm Deletion</button>
              <button onClick={() => setConfirmDelete(null)} className="cursor-pointer w-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 font-black italic uppercase text-[10px] py-4 rounded-2xl">Aborted Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}