import { useAuth } from '../../context/AuthContext.jsx';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-[#1c1c1e] border-b border-[#2e2e32] px-6 flex items-center justify-between select-none">
      <div className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
        TERMINAL {user?.rol?.replace('_', ' ')}
      </div>

      <div className="flex items-center gap-4 text-neutral-400">
        {/* Icono Campana */}
        <button className="hover:text-white transition-colors" title="Notificaciones">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Icono Perfil */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#2e2e32]">
          <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-neutral-300 font-medium hidden sm:inline">
            {user?.nombre}
          </span>
        </div>
      </div>
    </header>
  );
};
