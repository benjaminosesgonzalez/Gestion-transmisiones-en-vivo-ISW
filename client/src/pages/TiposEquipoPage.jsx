import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Boton } from '../components/ui/Boton.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';

export const TiposEquipoPage = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarTipos = async () => {
    try {
      const res = await api.get('/tipos-equipo');
      setTipos(res.data || []);
    } catch (error) {
      console.error('Error al cargar tipos de equipo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    setGuardando(true);
    try {
      if (editandoId) {
        await api.put(`/tipos-equipo/${editandoId}`, { nombre: nombre.trim() });
        setMensaje({ tipo: 'exito', texto: 'Categoría actualizada correctamente.' });
      } else {
        await api.post('/tipos-equipo', { nombre: nombre.trim() });
        setMensaje({ tipo: 'exito', texto: 'Categoría creada exitosamente.' });
      }
      limpiarFormulario();
      cargarTipos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al guardar la categoría.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.delete(`/tipos-equipo/${id}`);
      cargarTipos();
    } catch (error) {
      alert(error.response?.data?.message || 'No se puede eliminar: existen equipos asociados a esta categoría.');
    }
  };

  const columnas = [
    {
      header: 'ID',
      render: (row) => <span className="font-mono text-neutral-400">CAT-{String(row.id).padStart(2, '0')}</span>,
    },
    {
      header: 'NOMBRE DE CATEGORÍA',
      render: (row) => <span className="font-bold text-white uppercase">{row.nombre}</span>,
    },
    {
      header: 'ACCIONES',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditandoId(row.id);
              setNombre(row.nombre);
              setMensaje({ tipo: '', texto: '' });
            }}
            className="px-2.5 py-1 rounded bg-[#252528] hover:bg-[#2e2e32] border border-[#3a3a3f] text-[10px] font-bold uppercase text-neutral-200"
          >
            EDITAR
          </button>
          <button
            onClick={() => handleEliminar(row.id)}
            className="px-2.5 py-1 rounded bg-[#252528] hover:bg-rose-500/20 border border-[#3a3a3f] hover:border-rose-500/40 text-[10px] font-bold uppercase text-rose-400"
          >
            ELIMINAR
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-xs text-neutral-400 animate-pulse">Cargando categorías...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          CATEGORÍAS DE INVENTARIO ({tipos.length})
        </h1>
        <DataTable columns={columnas} data={tipos} emptyMessage="No hay categorías registradas." />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {editandoId ? 'EDITAR CATEGORÍA' : 'CREAR CATEGORÍA'}
          </h2>
          {editandoId && (
            <button type="button" onClick={limpiarFormulario} className="text-[11px] text-neutral-400 hover:text-white">
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

        <form onSubmit={handleGuardar} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Nombre de Categoría
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: ILUMINACIÓN"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white uppercase focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <Boton type="submit" disabled={guardando} className="w-full py-2.5">
            {guardando ? 'Guardando...' : editandoId ? 'Actualizar Categoría' : 'Guardar Categoría'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
