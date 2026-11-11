import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar qué grupos desplegables están abiertos
  const [abiertos, setAbiertos] = useState({
    OPERACION: true,
    EVENTOS: true,
    INVENTARIO: true,
    FINANZAS: true,
  });

  const toggleGrupo = (grupo) => {
    setAbiertos((prev) => ({ ...prev, [grupo]: !prev[grupo] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const estructuraMenu = [
    {
      grupo: 'OPERACION',
      titulo: 'OPERACIÓN',
      roles: ['JEFE'],
      icono: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      items: [
        { nombre: 'CALENDARIO', ruta: '/jefe/asignaciones' },
        { nombre: 'OPERADORES', ruta: '/jefe/operadores' },
        { nombre: 'AUSENCIAS', ruta: '/jefe/ausencias' },
      ],
    },
    {
      grupo: 'EVENTOS',
      titulo: 'EVENTOS',
      roles: ['JEFE'],
      icono: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      items: [
        { nombre: 'EVENTOS', ruta: '/jefe/eventos' },
        { nombre: 'CLIENTES', ruta: '/clientes' },
        { nombre: 'AUSPICIADORES', ruta: '/jefe/auspiciadores' },
      ],
    },
    {
      grupo: 'INVENTARIO',
      titulo: 'INVENTARIO',
      roles: ['JEFE', 'JEFE_TECNICO'],
      icono: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      items: [
        { nombre: 'EQUIPOS', ruta: '/tecnico/inventario' },
        { nombre: 'KITS', ruta: '/tecnico/kits' },
        { nombre: 'TIPOS DE EQUIPO', ruta: '/tecnico/tipos' },
      ],
    },
    {
      grupo: 'FINANZAS',
      titulo: 'FINANZAS',
      roles: ['JEFE', 'CONTADOR'],
      icono: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      items: [
        { nombre: 'PAGOS', ruta: '/contador/finanzas' },
        { nombre: 'GASTOS', ruta: '/contador/gastos' },
        { nombre: 'PÉRDIDAS', ruta: '/contador/perdidas' },
      ],
    },
  ];

  const gruposFiltrados = estructuraMenu.filter((g) => user && g.roles.includes(user.rol));
  const rutaInicio =
    user?.rol === 'JEFE'
      ? '/jefe/dashboard'
      : user?.rol === 'JEFE_TECNICO'
      ? '/tecnico/inventario'
      : '/contador/finanzas';

  return (
    <aside className="w-60 h-screen bg-[#1c1c1e] border-r border-[#2e2e32] flex flex-col justify-between text-neutral-300 select-none shrink-0">
      <div className="overflow-y-auto">
        {/* Marca Superior */}
        <div className="h-14 px-5 flex items-center gap-3 border-b border-[#2e2e32]">
          <svg className="w-6 h-6 text-[#5b73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <div className="leading-tight">
            <span className="block text-xs font-extrabold tracking-wider text-[#5b73e8]">EMPRESA</span>
            <span className="block text-xs font-extrabold tracking-wider text-[#5b73e8]">EVENTOS</span>
          </div>
        </div>

        {/* Botón INICIO */}
        <div className="p-3">
          <Link
            to={rutaInicio}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold tracking-wider transition-colors ${
              location.pathname === rutaInicio
                ? 'bg-[#2a2d3d] text-[#788ef5]'
                : 'text-neutral-400 hover:bg-[#252528] hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            INICIO
          </Link>
        </div>

        {/* Acordeones por Categoría */}
        <nav className="px-3 space-y-2">
          {gruposFiltrados.map((grupo) => {
            const estaAbierto = abiertos[grupo.grupo];
            return (
              <div key={grupo.grupo} className="space-y-1">
                <button
                  onClick={() => toggleGrupo(grupo.grupo)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-neutral-400">{grupo.icono}</span>
                    {grupo.titulo}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                      estaAbierto ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {estaAbierto && (
                  <div className="pl-10 space-y-1 pb-1">
                    {grupo.items.map((item) => {
                      const activo = location.pathname === item.ruta;
                      return (
                        <Link
                          key={item.ruta}
                          to={item.ruta}
                          className={`block py-1.5 text-[11px] font-medium tracking-wide transition-colors ${
                            activo ? 'text-[#788ef5] font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          {item.nombre}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Pie de Sidebar: Configuración y Salir */}
      <div className="border-t border-[#2e2e32] p-3 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[11px] font-bold tracking-wider text-neutral-400 hover:bg-[#252528] hover:text-rose-400 transition-colors"
        >
          <span className="flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            CERRAR SESIÓN
          </span>
        </button>
      </div>
    </aside>
  );
};
