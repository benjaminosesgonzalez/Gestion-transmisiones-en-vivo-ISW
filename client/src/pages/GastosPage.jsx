import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const GastosPage = () => {
  const [gastos, setGastos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [eventoId, setEventoId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    try {
      const [resGastos, resEventos] = await Promise.all([
        api.get('/gastos'),
        api.get('/eventos'),
      ]);
      setGastos(resGastos.data || []);
      const listaEv = resEventos.data || [];
      setEventos(listaEv);
      if (listaEv.length > 0 && !eventoId) {
        setEventoId(listaEv[0].id.toString());
      }
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardarGasto = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!eventoId || !descripcion.trim() || !monto || Number(monto) <= 0) {
      setMensaje({ tipo: 'error', texto: 'Completa todos los campos con un monto válido.' });
      return;
    }

    setGuardando(true);
    try {
      await api.post('/gastos', {
        eventoId: parseInt(eventoId),
        descripcion: descripcion.trim(),
        monto: Number(monto),
        fecha,
      });

      setMensaje({ tipo: 'exito', texto: 'Gasto operativo registrado y descontado del balance.' });
      setDescripcion('');
      setMonto('');
      cargarDatos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al registrar el gasto.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarGasto = async (id) => {
    if (!window.confirm('¿Eliminar este registro de gasto?')) return;
    try {
      await api.delete(`/gastos/${id}`);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar el gasto.');
    }
  };

  const columnas = [
    {
      header: 'EVENTO',
      render: (row) => (
        <div>
          <p className="font-bold text-[#788ef5] uppercase">{row.evento?.nombre}</p>
          <span className="font-mono text-[10px] text-neutral-500">
            EVT-{String(row.eventoId).padStart(4, '0')}
          </span>
        </div>
      ),
    },
    {
      header: 'CONCEPTO / DESCRIPCIÓN',
      render: (row) => <span className="text-neutral-200">{row.descripcion}</span>,
    },
    {
      header: 'FECHA',
      render: (row) => (
        <span className="text-neutral-400">
          {new Date(row.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })}
        </span>
      ),
    },
    {
      header: 'MONTO',
      render: (row) => (
        <span className="font-bold text-rose-400">
          -${Number(row.monto || 0).toLocaleString('es-CL')}
        </span>
      ),
    },
    {
      header: 'ACCIONES',
      render: (row) => (
        <button
          onClick={() => handleEliminarGasto(row.id)}
          className="text-[10px] font-bold uppercase text-rose-400 hover:text-rose-300"
        >
          Eliminar
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando registro de gastos...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          REGISTRO DE GASTOS OPERATIVOS ({gastos.length})
        </h1>
        <DataTable
          columns={columnas}
          data={gastos}
          emptyMessage="No hay gastos operativos registrados."
        />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="border-b border-[#2e2e32] pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">+ Registrar Gasto</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Se restará automáticamente de la rentabilidad del evento
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

        <form onSubmit={handleGuardarGasto} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Evento Asociado
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
              Título / Descripción del Gasto
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Alimentación equipo técnico, arriendo extra..."
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Monto (CLP)
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
            {guardando ? 'Registrando...' : 'GUARDAR GASTO'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
