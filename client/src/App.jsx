import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Sidebar } from './components/ui/Sidebar.jsx';
import { Header } from './components/ui/Header.jsx';

// Layout compartido que muestra la Sidebar a la izquierda y el contenido a la derecha
const MainLayout = () => (
  <div className="flex h-screen bg-[#18181a] text-neutral-200 overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

// Vistas temporales mientras construimos la Fase 4
const PlaceholderVista = ({ titulo }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
    <h2 className="text-lg font-bold text-white">{titulo}</h2>
    <p className="text-xs text-slate-400 mt-1">Terminal conectado y autenticado correctamente.</p>
  </div>
);

export default function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas con el marco de Sidebar */}
      <Route element={<MainLayout />}>
        {/* Terminal Jefe */}
        <Route element={<ProtectedRoute allowedRoles={['JEFE']} />}>
          <Route path="/jefe/dashboard" element={<PlaceholderVista titulo="Dashboard Global - Terminal Jefe" />} />
          <Route path="/clientes" element={<PlaceholderVista titulo="Gestión de Clientes" />} />
          <Route path="/jefe/asignaciones" element={<PlaceholderVista titulo="Asignaciones Operativas" />} />
        </Route>

        {/* Terminal Jefe Técnico (El JEFE también tiene acceso global) */}
        <Route element={<ProtectedRoute allowedRoles={['JEFE', 'JEFE_TECNICO']} />}>
          <Route path="/tecnico/inventario" element={<PlaceholderVista titulo="Inventario de Equipos" />} />
          <Route path="/tecnico/kits" element={<PlaceholderVista titulo="Configurador de Kits" />} />
        </Route>

        {/* Terminal Contador (El JEFE también tiene acceso global) */}
        <Route element={<ProtectedRoute allowedRoles={['JEFE', 'CONTADOR']} />}>
          <Route path="/contador/finanzas" element={<PlaceholderVista titulo="Auditoría Financiera y Egresos" />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
