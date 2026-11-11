import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [clienteId, setClienteId] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('14:00');
  const [horaFin, setHoraFin] = useState('20:00');
  const [zona, setZona] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [estado, setEstado] = useState('PROGRAMADO');

  const cargarDatos = async () => {
    try {
      const [resEv, resCli] = await Promise.all([
        api.get('/eventos'),
        api.get('/clientes'),
      ]);
      setEventos(resEv.data || []);
      const listaCli = resCli.data || [];
      setClientes(listaCli);
    if (listaCli.length > 0 && !clienteId) {
    setClienteId(listaCli[0].id.toString());
    }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiar = () => {
    setEditandoId(null);
    setNombre('');
    setTipo('');
    setFecha('');
    setHoraInicio('14:00');
    setHoraFin('20:00');
    setZona('');
    setValorTotal('');
    setEstado('PROGRAMADO');
  };

  const seleccionarEditar = (ev) => {
    setEditandoId(ev.id);
    setClienteId(ev.clienteId.toString());
    setNombre(ev.nombre);
    setTipo(ev.tipo || '');
    setFecha(ev.fecha ? ev.fecha.split('T')[0] : '');
    setHoraInicio(ev.horaInicio ? new Date(ev.horaInicio).toISOString().substring(11, 16) : '14:00');
    setHoraFin(ev.horaFin ? new Date(ev.horaFin).toISOString().substring(11, 16) : '20:00');
    setZona(ev.zona || '');
    setValorTotal(ev.valorTotal || '');
    setEstado(ev.estado);
    setMensaje({ tipo: '', texto: '' });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!clienteId || !nombre.trim() || !fecha || !valorTotal) {
      setMensaje({ tipo: 'error', texto: 'Completa cliente, nombre, fecha y valor total.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        clienteId: parseInt(clienteId),
        nombre: nombre.trim(),
        tipo: tipo.trim() || 'General',
        fecha,
        horaInicio,
        horaFin,
        zona: zona.trim() || 'Por definir',
        valorTotal: Number(valorTotal),
        estado,
      };

      if (editandoId) {
        await api.put(`/eventos/${editandoId}`, payload);
        setMensaje({
          tipo: 'exito',
          texto: estado === 'CANCELADO'
            ? 'Evento cancelado y personal liberado automáticamente.'
            : 'Evento actualizado exitosamente.',
        });
      } else {
        await api.post('/eventos', payload);
        setMensaje({
          tipo: 'exito',
          texto: 'Evento creado. Si dura más de 5 hrs, se generaron los pagos automáticos.',
        });
      }
      limpiar();
      cargarDatos();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error al guardar evento.' });
    } finally {
      setGuardando(false);
    }
  };

  const columnas = [
    {
      header: 'EVENTO',
      render: (row) => (
        <div>
          <span className="font-mono text-[10px] text-[#788ef5]">
            EVT-{String(row.id).padStart(4, '0')} • {row.tipo}
          </span>
          <p className="font-bold text-white uppercase">{row.nombre}</p>
          <span className="text-[11px] text-neutral-500">{row.cliente?.nombre} • {row.zona}</span>
        </div>
      ),
    },
    {
      header: 'FECHA Y HORARIO',
      render: (row) => (
        <span className="text-neutral-300 text-xs">
          {new Date(row.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })} •{' '}
          {new Date(row.horaInicio).toISOString().substring(11, 16)} -{' '}
          {new Date(row.horaFin).toISOString().substring(11, 16)}
        </span>
      ),
    },
    {
      header: 'VALOR',
      render: (row) => (
        <span className="font-bold text-white">
          ${Number(row.valorTotal || 0).toLocaleString('es-CL')}
        </span>
      ),
    },
    {
      header: 'ESTADO',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
            row.estado === 'CANCELADO'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {row.estado}
        </span>
      ),
    },
    {
      header: 'ACCIONES',
      render: (row) => (
        <button
          onClick={() => seleccionarEditar(row)}
          className="px-2.5 py-1 rounded bg-[#252528] hover:bg-[#2e2e32] border border-[#3a3a3f] text-[10px] font-bold uppercase text-neutral-200"
        >
          EDITAR
        </button>
      ),
    },
  ];

  if (loading) return <div className="text-xs text-neutral-400 animate-pulse">Cargando eventos...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          GESTIÓN DE EVENTOS ({eventos.length})
        </h1>
        <DataTable columns={columnas} data={eventos} emptyMessage="No hay eventos registrados." />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {editandoId ? 'EDITAR EVENTO' : '+ CREAR EVENTO'}
          </h2>
          {editandoId && (
            <button type="button" onClick={limpiar} className="text-[11px] text-neutral-400 hover:text-white">
              Cancelar
            </button>
          )}
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

        <form onSubmit={handleGuardar} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">
              Nombre Transmisión
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Final Copa Regional"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">
                Tipo de Evento
              </label>
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ej: Partido, Matrimonio..."
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">
                Hora Inicio
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Hora Fin</label>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Zona / Lugar</label>
            <input
              type="text"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Estadio / Teatro"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Valor Total ($)</label>
            <input
              type="number"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              placeholder="1000000"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          {editandoId && (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Estado Evento</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              >
                <option value="PROGRAMADO">PROGRAMADO</option>
                <option value="EN CURSO">EN CURSO</option>
                <option value="FINALIZADO">FINALIZADO</option>
                <option value="CANCELADO">CANCELADO (Libera personal)</option>
              </select>
            </div>
          )}

          <Boton type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : editandoId ? 'ACTUALIZAR EVENTO' : 'GUARDAR EVENTO'}
          </Boton>
        </form>
      </div>
    </div>
);
};