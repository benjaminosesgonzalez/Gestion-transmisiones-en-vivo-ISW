import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const AsignacionesPage = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState('PERSONAL'); // 'PERSONAL' | 'DESPACHO'
  const [eventoId, setEventoId] = useState('');
  const [operadorId, setOperadorId] = useState('');
  const [horaInicio, setHoraInicio] = useState('14:00');
  const [horaFin, setHoraFin] = useState('20:00');
  const [funcionIds, setFuncionIds] = useState([]);
  const [kitId, setKitId] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    try {
      const [resAsig, resEv, resOps, resFunc, resKits] = await Promise.all([
        api.get('/asignaciones'),
        api.get('/eventos'),
        api.get('/operadores'),
        api.get('/funciones'),
        api.get('/kits'),
      ]);
      const listaEv = (resEv.data || []).filter((e) => e.estado !== 'CANCELADO');
      const listaOps = resOps.data || [];
      const listaKits = resKits.data || [];

      setAsignaciones(resAsig.data || []);
      setEventos(listaEv);
      setOperadores(listaOps);
      setFunciones(resFunc.data || []);
      setKits(listaKits);

      if (listaEv.length > 0 && !eventoId) setEventoId(listaEv.at(0).id.toString());
      if (listaOps.length > 0 && !operadorId) setOperadorId(listaOps.at(0).id.toString());
      if (listaKits.length > 0 && !kitId) setKitId(listaKits.at(0).id.toString());
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleFuncion = (id) => {
    setFuncionIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleAsignarPersonal = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    if (!eventoId || !operadorId || funcionIds.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Selecciona evento, operador y al menos una función.' });
      return;
    }

    setGuardando(true);
    try {
      await api.post('/asignaciones', {
        eventoId: parseInt(eventoId),
        operadorId: parseInt(operadorId),
        horaInicio,
        horaFin,
        funcionIds,
      });
      setMensaje({ tipo: 'exito', texto: 'Operador asignado al evento exitosamente.' });
      setFuncionIds([]);
      cargarDatos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Conflicto de horario o ausencia.' });
    } finally {
      setGuardando(false);
    }
  };

  const handleDespacharKit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    if (!eventoId || !kitId) return;

    setGuardando(true);
    try {
      await api.post(`/despachos/evento/${eventoId}/kits`, {
        kits: [{ kitId: parseInt(kitId), cantidad: 1 }],
      });
      setMensaje({ tipo: 'exito', texto: 'Kit despachado y reservado para la transmisión.' });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Conflicto de stock en ese horario.' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarAsignacion = async (id) => {
    if (!window.confirm('¿Liberar esta asignación?')) return;
    try {
      await api.delete(`/asignaciones/${id}`);
      cargarDatos();
    } catch (error) {
      alert('Error al eliminar asignación.');
    }
  };

  const columnas = [
    {
      header: 'EVENTO',
      render: (row) => (
        <div>
          <p className="font-bold text-[#788ef5] uppercase">{row.evento?.nombre}</p>
          <span className="text-[11px] text-neutral-500">
            {row.evento?.fecha ? new Date(row.evento.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' }) : ''}
          </span>
        </div>
      ),
    },
    { header: 'OPERADOR', render: (row) => <span className="font-bold text-white">{row.operador?.nombre}</span> },
    {
      header: 'HORARIO',
      render: (row) => (
        <span className="font-mono text-neutral-300">
          {new Date(row.horaInicio).toISOString().substring(11, 16)} - {new Date(row.horaFin).toISOString().substring(11, 16)}
        </span>
      ),
    },
    {
      header: 'ROLES',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.funciones || []).map((f) => (
            <span key={f.funcionId} className="px-2 py-0.5 rounded bg-[#252528] border border-[#3a3a3f] text-[10px] text-neutral-200">
              {f.funcion?.nombre}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'ACCIONES',
      render: (row) => (
        <button onClick={() => handleEliminarAsignacion(row.id)} className="text-[10px] font-bold uppercase text-rose-400 hover:text-rose-300">
          Liberar
        </button>
      ),
    },
  ];

  if (loading) return <div className="text-xs text-neutral-400 animate-pulse">Cargando programación...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">PROGRAMACIÓN DE PERSONAL ({asignaciones.length})</h1>
        <DataTable columns={columnas} data={asignaciones} emptyMessage="No hay asignaciones activas." />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="grid grid-cols-2 gap-1 bg-[#18181a] p-1 rounded-md border border-[#2e2e32]">
          <button
            type="button"
            onClick={() => { setTab('PERSONAL'); setMensaje({ tipo: '', texto: '' }); }}
            className={`py-1.5 rounded text-[10px] font-bold uppercase ${tab === 'PERSONAL' ? 'bg-[#5b73e8] text-white' : 'text-neutral-400'}`}
          >
            + PERSONAL
          </button>
          <button
            type="button"
            onClick={() => { setTab('DESPACHO'); setMensaje({ tipo: '', texto: '' }); }}
            className={`py-1.5 rounded text-[10px] font-bold uppercase ${tab === 'DESPACHO' ? 'bg-[#5b73e8] text-white' : 'text-neutral-400'}`}
          >
            + DESPACHO KIT
          </button>
        </div>

        {mensaje.texto && (
          <div className={`p-3 rounded text-xs border ${mensaje.tipo === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            {mensaje.texto}
          </div>
        )}

        {tab === 'PERSONAL' ? (
          <form onSubmit={handleAsignarPersonal} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Evento</label>
              <select value={eventoId} onChange={(e) => setEventoId(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white">
                {eventos.map((ev) => <option key={ev.id} value={ev.id}>EVT-{String(ev.id).padStart(4, '0')} - {ev.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Operador</label>
              <select value={operadorId} onChange={(e) => setOperadorId(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white">
                {operadores.map((op) => <option key={op.id} value={op.id}>{op.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-neutral-400">Inicio</label>
                <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-neutral-400">Fin</label>
                <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Funciones a cumplir</label>
              <div className="flex flex-wrap gap-1.5">
                {funciones.map((fn) => (
                  <button
                    key={fn.id}
                    type="button"
                    onClick={() => toggleFuncion(fn.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                      funcionIds.includes(fn.id) ? 'bg-[#5b73e8]/20 text-[#788ef5] border-[#5b73e8]' : 'bg-[#18181a] text-neutral-400 border-[#2e2e32]'
                    }`}
                  >
                    {fn.nombre}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={guardando} className="w-full px-3 py-2 rounded bg-[#5b73e8] text-xs font-bold uppercase text-white disabled:opacity-50">
              {guardando ? 'Validando...' : 'ASIGNAR OPERADOR'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleDespacharKit} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Evento Destino</label>
              <select value={eventoId} onChange={(e) => setEventoId(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white">
                {eventos.map((ev) => <option key={ev.id} value={ev.id}>EVT-{String(ev.id).padStart(4, '0')} - {ev.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Kit Logístico a Despachar</label>
              <select value={kitId} onChange={(e) => setKitId(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white">
                {kits.map((k) => <option key={k.id} value={k.id}>{k.nombre}</option>)}
              </select>
            </div>
            <button type="submit" disabled={guardando} className="w-full px-3 py-2 rounded bg-[#5b73e8] text-xs font-bold uppercase text-white disabled:opacity-50">
              {guardando ? 'Verificando Stock...' : 'DESPACHAR KIT AL EVENTO'}
            </button>
          </form>
        )}

      </div>
    </div>
);
};