import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const AusenciasPage = () => {
  const [operadores, setOperadores] = useState([]);
  const [ausenciasLista, setAusenciasLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const [operadorId, setOperadorId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [motivo, setMotivo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    try {
      const res = await api.get('/operadores');
      const listaOps = res.data || [];
      setOperadores(listaOps);

        if (listaOps.length > 0 && !operadorId) {
        setOperadorId(listaOps[0].id.toString());
        }

      // Aplanar todas las ausencias vinculando el nombre de cada operador
      const todasAusencias = [];
      listaOps.forEach((op) => {
        (op.ausencias || []).forEach((aus) => {
          todasAusencias.push({
            ...aus,
            operadorNombre: op.nombre,
            operadorRut: op.rut,
          });
        });
      });

      // Ordenar por fecha de inicio más reciente
      todasAusencias.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
      setAusenciasLista(todasAusencias);
    } catch (error) {
      console.error('Error al cargar ausencias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleRegistrarAusencia = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    const handleEliminarAusencia = async (id) => {
    if (!window.confirm('¿Eliminar este registro de ausencia?')) return;
    try {
        await api.delete(`/operadores/ausencias/${id}`);
        cargarDatos();
    } catch (error) {
        alert(error.response?.data?.message || 'Error al eliminar la ausencia.');
    }
    };

    
    if (!operadorId || !fechaInicio || !fechaFin) {
      setMensaje({ tipo: 'error', texto: 'Selecciona un operador y ambas fechas.' });
      return;
    }

    setGuardando(true);
    try {
      await api.post(`/operadores/${operadorId}/ausencias`, {
        fechaInicio,
        fechaFin,
        motivo: motivo.trim() || null,
      });

      setMensaje({
        tipo: 'exito',
        texto: 'Ausencia registrada. El operador quedará bloqueado para asignaciones en ese rango.',
      });
      setFechaInicio('');
      setFechaFin('');
      setMotivo('');
      cargarDatos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al registrar la ausencia.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (iso) => {
    if (!iso) return '--';
    return new Date(iso).toLocaleDateString('es-CL', { timeZone: 'UTC' });
  };

  const columnas = [
    {
      header: 'OPERADOR',
      render: (row) => (
        <div>
          <p className="font-bold text-white">{row.operadorNombre}</p>
          <span className="text-[10px] text-neutral-500">{row.operadorRut || 'Sin RUT'}</span>
        </div>
      ),
    },
    {
      header: 'DESDE',
      render: (row) => <span className="font-mono text-neutral-200">{formatearFecha(row.fechaInicio)}</span>,
    },
    {
      header: 'HASTA',
      render: (row) => <span className="font-mono text-neutral-200">{formatearFecha(row.fechaFin)}</span>,
    },
    {
      header: 'MOTIVO / OBSERVACIÓN',
      render: (row) => <span className="text-neutral-300">{row.motivo || 'Sin especificar'}</span>,
    },
    {
    header: 'ACCIONES',
    render: (row) => (
        <button
        onClick={() => handleEliminarAusencia(row.id)}
        className="px-2.5 py-1 rounded bg-[#252528] hover:bg-rose-500/20 border border-[#3a3a3f] hover:border-rose-500/40 text-[10px] font-bold uppercase text-rose-400 transition-colors"
        >
        ELIMINAR
        </button>
    ),
    },
    
  ];

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando historial de ausencias...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          REGISTRO DE AUSENCIAS Y LICENCIAS ({ausenciasLista.length})
        </h1>
        <DataTable
          columns={columnas}
          data={ausenciasLista}
          emptyMessage="No hay ausencias registradas para ningún operador."
        />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">+ REGISTRAR AUSENCIA</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Bloquea la disponibilidad del operador en el calendario
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

        <form onSubmit={handleRegistrarAusencia} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Operador</label>
            <select
              value={operadorId}
              onChange={(e) => setOperadorId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {operadores.map((op) => (
                <option key={op.id} value={op.id}>{op.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Fecha Término</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Motivo</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Vacaciones anuales, Licencia médica..."
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <Boton type="submit" disabled={guardando} className="w-full py-2.5">
            {guardando ? 'Registrando...' : 'GUARDAR AUSENCIA'}
          </Boton>
        </form>
      </div>
    </div>
  );
};