import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardJefe } from './pages/DashboardJefe.jsx'; // <-- 1. Importar aquí
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Sidebar } from './components/ui/Sidebar.jsx';
import { Header } from './components/ui/Header.jsx';
import { DashboardJefeTecnico } from './pages/DashboardJefeTecnico.jsx';
import { KitsPage } from './pages/KitsPage.jsx';
import { TiposEquipoPage } from './pages/TiposEquipoPage.jsx';
import { DashboardContador } from './pages/DashboardContador.jsx';
import { GastosPage } from './pages/GastosPage.jsx';
import { PerdidasPage } from './pages/PerdidasPage.jsx';
import { LiquidacionesPage } from './pages/LiquidacionesPage.jsx';
import { OperadoresPage } from './pages/OperadoresPage.jsx';
import { AusenciasPage } from './pages/AusenciasPage.jsx';
import { ClientesPage } from './pages/ClientesPage.jsx';
import { AuspiciadoresPage } from './pages/AuspiciadoresPage.jsx';
import { EventosPage } from './pages/EventosPage.jsx';
import { AsignacionesPage } from './pages/AsignacionesPage.jsx';

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

const PlaceholderVista = ({ titulo }) => (
  <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-6">
    <h2 className="text-sm font-bold uppercase tracking-wider text-white">{titulo}</h2>
    <p className="text-xs text-neutral-400 mt-1">Módulo en construcción.</p>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        {/* Terminal Jefe */}
        <Route element={<ProtectedRoute allowedRoles={['JEFE']} />}>
          {/* 2. Reemplazar el placeholder por la vista real */}
          <Route path="/jefe/dashboard" element={<DashboardJefe />} />
          <Route path="/jefe/operadores" element={<OperadoresPage />} />
          <Route path="/jefe/ausencias" element={<AusenciasPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/jefe/auspiciadores" element={<AuspiciadoresPage />} />
          <Route path="/jefe/eventos" element={<EventosPage />} />
          <Route path="/jefe/asignaciones" element={<AsignacionesPage />} />
        </Route>

        {/* Terminal Jefe Técnico */}
        <Route element={<ProtectedRoute allowedRoles={['JEFE', 'JEFE_TECNICO']} />}>
          <Route path="/tecnico/inventario" element={<DashboardJefeTecnico />} />
          <Route path="/tecnico/kits" element={<KitsPage />} />
          <Route path="/tecnico/tipos" element={<TiposEquipoPage />} />
        </Route>

        {/* Terminal Contador */}
        <Route element={<ProtectedRoute allowedRoles={['JEFE', 'CONTADOR']} />}>
          <Route path="/contador/finanzas" element={<DashboardContador />} />
          <Route path="/contador/gastos" element={<GastosPage />} />
          <Route path="/contador/perdidas" element={<PerdidasPage />} />
          <Route path="/contador/liquidaciones" element={<LiquidacionesPage />} />
        </Route>

      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
