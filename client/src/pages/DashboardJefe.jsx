import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { StatCard } from '../components/ui/StatCard.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const DashboardJefe = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [recaudadoMes, setRecaudadoMes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        const [resEventos, resOperadores, resEquipos] = await Promise.all([
          api.get('/eventos'),
          api.get('/operadores'),
          api.get('/equipos'),
        ]);

        const listaEventos = resEventos.data || [];
        const listaOperadores = resOperadores.data || [];
        const listaEquipos = resEquipos.data || [];

        setEventos(listaEventos);
        setOperadores(listaOperadores);

        // Calcular recaudación total
        let totalPagado = 0;
        listaEventos.forEach((ev) => {
          (ev.pagos || []).forEach((pago) => {
            if (pago.estadoPago === 'PAGADO') {
              totalPagado += Number(pago.montoTotal || 0);
            }
          });
        });
        setRecaudadoMes(totalPagado);

        // Generar alertas reales: 1) Equipos Dañados/Perdidos, 2) Eventos sin operadores
        const alertasReales = [];

        listaEquipos.forEach((eq) => {
          if (eq.estado === 'DANADO' || eq.estado === 'PERDIDO') {
            alertasReales.push({
              id: `eq-${eq.id}`,
              tipo: 'INVENTARIO',
              etiqueta: `EQUIPO ${eq.estado}`,
              codigo: `EQ-${String(eq.id).padStart(3, '0')}`,
              mensaje: `La pieza "${eq.nombre}" (${eq.tipoEquipo?.nombre || 'General'}) está fuera de servicio.`,
              rutaDestino: '/tecnico/inventario',
              textoBoton: 'REVISAR INVENTARIO',
            });
          }
        });

        listaEventos.forEach((ev) => {
          if (ev.estado !== 'CANCELADO' && ev.estado !== 'FINALIZADO' && (!ev.asignaciones || ev.asignaciones.length === 0)) {
            alertasReales.push({
              id: `ev-${ev.id}`,
              tipo: 'PERSONAL',
              etiqueta: 'FALTA PERSONAL',
              codigo: `EVT-${String(ev.id).padStart(4, '0')}`,
              mensaje: `La transmisión "${ev.nombre}" aún no tiene operadores asignados.`,
              rutaDestino: '/jefe/asignaciones',
              textoBoton: 'ASIGNAR EQUIPO',
            });
          }
        });

        setAlertas(alertasReales);

      } catch (error) {
        console.error('Error al cargar métricas del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDashboard();
  }, []);

  // Formatear horas desde el formato ISO de Prisma (1970-01-01T16:00:00.000Z -> 16:00)
  const formatearHora = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toISOString().substring(11, 16);
  };

  // Formatear fecha (2026-11-25T00:00:00.000Z -> 25 Nov)
  const formatearFecha = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', timeZone: 'UTC' });
  };

  const operadoresActivos = operadores.filter((op) => op.estado === 'ACTIVO').length;
  const eventosActivos = eventos.filter((ev) => ev.estado !== 'CANCELADO');

  const columnasEventos = [
    {
      header: 'ID',
      render: (row) => (
        <span className="font-mono text-[11px] font-semibold text-neutral-400">
          EVT-{String(row.id).padStart(4, '0')}
        </span>
      ),
    },
    {
      header: 'EVENTO / CLIENTE',
      render: (row) => (
        <div>
          <p className="font-semibold text-white">{row.nombre}</p>
          <p className="text-[11px] text-neutral-500">
            {row.cliente?.nombre} • {row.zona}
          </p>
        </div>
      ),
    },
    {
      header: 'HORARIO',
      render: (row) => (
        <span className="text-neutral-300">
          {formatearFecha(row.fecha)}, {formatearHora(row.horaInicio)} - {formatearHora(row.horaFin)}
        </span>
      ),
    },
    {
      header: 'ESTADO',
      render: (row) => {
        const tienePersonal = (row.asignaciones || []).length > 0;
        if (row.estado === 'CANCELADO') {
          return (
            <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-400 border border-neutral-700">
              CANCELADO
            </span>
          );
        }
        return tienePersonal ? (
          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            ASIGNADO
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
            FALTA PERSONAL
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando métricas operativas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Título Principal */}
      <h1 className="text-xl font-extrabold tracking-wide text-white uppercase">
        VISTA GENERAL
      </h1>

      {/* Fila Superior: 3 Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          titulo="EVENTOS ACTIVOS"
          valor={eventosActivos.length}
          subtitulo="Programados y en curso"
          accent="indigo"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatCard
          titulo="OPERADORES ACTIVOS"
          valor={
            <span>
              {operadoresActivos}
              <span className="text-sm font-normal text-neutral-500">/{operadores.length}</span>
            </span>
          }
          subtitulo="Personal técnico habilitado"
          accent="indigo"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <StatCard
          titulo="RECAUDADO (TOTAL)"
          valor={`$${recaudadoMes.toLocaleString('es-CL')}`}
          subtitulo="Pagos confirmados en sistema"
          accent="emerald"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Fila Inferior: Tabla de Próximos Eventos (Izquierda) + Alertas Reales (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">
              PRÓXIMOS EVENTOS
            </h2>
            <Link
              to="/jefe/eventos"
              className="text-[11px] font-bold tracking-wider text-[#5b73e8] hover:text-[#788ef5] uppercase"
            >
              VER TODOS LOS EVENTOS
            </Link>
          </div>

          <DataTable
            columns={columnasEventos}
            data={eventosActivos}
            emptyMessage="No hay eventos programados actualmente."
          />
        </div>

        {/* Columna Derecha (1/3): Sistema de Alertas Operativas Reales */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-sm font-bold tracking-wider uppercase">
              SISTEMA: ALERTAS
            </h2>
          </div>

          {alertas.length === 0 ? (
            <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 text-xs text-neutral-400">
              Operación nominal. Sin equipos averiados ni eventos sin cobertura.
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`bg-[#1c1c1e] border rounded-lg p-4 space-y-3 ${
                    alerta.tipo === 'INVENTARIO'
                      ? 'border-rose-500/40'
                      : 'border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase ${
                        alerta.tipo === 'INVENTARIO' ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    >
                      {alerta.etiqueta}
                    </span>
                    <span className="text-[10px] text-neutral-500">{alerta.codigo}</span>
                  </div>

                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {alerta.mensaje}
                  </p>

                  <Boton
                    variant="secondary"
                    onClick={() => navigate(alerta.rutaDestino)}
                    className="text-[11px] py-1.5 px-3"
                  >
                    {alerta.textoBoton}
                  </Boton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
