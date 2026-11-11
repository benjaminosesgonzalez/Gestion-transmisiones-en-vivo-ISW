import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const PerdidasPage = () => {
  const [perdidas, setPerdidas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [eventoId, setEventoId] = useState('');
  const [equipoId, setEquipoId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    try {
      const [resInc, resEventos, resEquipos] = await Promise.all([
        api.get('/liquidaciones/incidentes'),
        api.get('/eventos'),
        api.get('/equipos'),
      ]);
      setPerdidas(resInc.data || []);
      const listaEv = resEventos.data || [];
      const listaEq = resEquipos.data || [];
      setEventos(listaEv);
      setEquipos(listaEq);

      if (listaEv.length > 0 && !eventoId) setEventoId(listaEv[0].id.toString());
      if (listaEq.length > 0 && !equipoId) setEquipoId(listaEq[0].id.toString());
    } catch (error) {
      console.error('Error al cargar pérdidas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleReportarPerdida = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!eventoId || !equipoId || !descripcion.trim() || !monto || Number(monto) <= 0) {
      setMensaje({ tipo: 'error', texto: 'Todos los campos son obligatorios.' });
      return;
    }

    setGuardando(true);
    try {
      await api.post('/liquidaciones/incidente', {
        eventoId: parseInt(eventoId),
        equipoId: parseInt(equipoId),
        descripcion: descripcion.trim(),
        monto: Number(monto),
        fecha,
      });

      setMensaje({
        tipo: 'exito',
        texto: 'Incidente registrado. El equipo ha sido marcado como DAÑADO en inventario.',
      });
      setDescripcion('');
      setMonto('');
      cargarDatos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al registrar la pérdida.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const columnas = [
    {
      header: 'EQUIPO AFECTADO',
      render: (row) => (
        <div>
          <p className="font-bold text-white uppercase">{row.equipo?.nombre}</p>
          <span className="font-mono text-[10px] text-[#788ef5]">
            EQ-{String(row.equipoId).padStart(3, '0')}
          </span>
        </div>
      ),
    },
    {
      header: 'EVENTO',
      render: (row) => (
        <span className="text-neutral-300">
          EVT-{String(row.eventoId).padStart(4, '0')} • {row.evento?.nombre}
        </span>
      ),
    },
    {
      header: 'DETALLE DEL DAÑO',
      render: (row) => <span className="text-neutral-400">{row.descripcion}</span>,
    },
    {
      header: 'VALOR PÉRDIDA',
      render: (row) => (
        <span className="font-bold text-rose-400">
          ${Number(row.monto || 0).toLocaleString('es-CL')}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando registro de pérdidas...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          INCIDENTES DE INVENTARIO Y PÉRDIDAS ({perdidas.length})
        </h1>
        <DataTable
          columns={columnas}
          data={perdidas}
          emptyMessage="No hay pérdidas ni daños de equipo reportados."
        />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="border-b border-[#2e2e32] pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">+ Reportar Pérdida / Daño</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Inhabilita el equipo y habilita el descuento en liquidación
          </p>
        </div>

        {mensaje.texto && (
          <div
            className={`p-3 rounded text-xs border ${
              mensaje.tipo === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleReportarPerdida} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Evento donde ocurrió
            </label>
            <select
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  EVT-{String(ev.id).padStart(4, '0')} - {ev.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Equipo Afectado
            </label>
            <select
              value={equipoId}
              onChange={(e) => setEquipoId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {equipos.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  EQ-{String(eq.id).padStart(3, '0')} - {eq.nombre} ({eq.estado})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Descripción del Daño
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Cable cortado, lente trizado..."
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Costo Reposición / Daño ($)
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="$ 0"
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
          </div>

          <Boton type="submit" disabled={guardando} className="w-full py-2.5">
            {guardando ? 'Registrando...' : 'REPORTAR INCIDENTE'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
