import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Boton } from '../components/ui/Boton.jsx';

export const DashboardJefeTecnico = () => {
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros de la barra superior
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  // Estados del formulario (Crear / Editar)
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [estado, setEstado] = useState('DISPONIBLE');
  const [valorReposicion, setValorReposicion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    try {
      const [resEquipos, resTipos] = await Promise.all([
        api.get('/equipos'),
        api.get('/tipos-equipo'),
      ]);
      setEquipos(resEquipos.data || []);
      const listaTipos = resTipos.data || [];
      setCategorias(listaTipos);
      if (listaTipos.length > 0 && !tipoId) {
        setTipoId(listaTipos[0].id.toString());
      }
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setEstado('DISPONIBLE');
    setValorReposicion('');
    if (categorias.length > 0) {
      setTipoId(categorias[0].id.toString()); // <-- Agregamos [0]
    }
  };

  const seleccionarParaEditar = (eq) => {
    setEditandoId(eq.id);
    setNombre(eq.nombre);
    setTipoId(eq.tipoId.toString());
    setEstado(eq.estado);
    setValorReposicion(eq.valorReposicion || '');
    setMensaje({ tipo: '', texto: '' });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!nombre.trim() || !tipoId) {
      setMensaje({ tipo: 'error', texto: 'Nombre y categoría son obligatorios.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        tipoId: parseInt(tipoId),
        estado,
        valorReposicion: valorReposicion ? Number(valorReposicion) : null,
      };

      if (editandoId) {
        await api.put(`/equipos/${editandoId}`, payload);
        setMensaje({ tipo: 'exito', texto: 'Equipo actualizado correctamente.' });
      } else {
        await api.post('/equipos', payload);
        setMensaje({ tipo: 'exito', texto: 'Equipo registrado en inventario.' });
      }

      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al guardar equipo.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este equipo del inventario?')) return;
    try {
      await api.delete(`/equipos/${id}`);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || 'No se puede eliminar: el equipo está en uso.');
    }
  };

  // Aplicar filtros en tiempo real
  const equiposFiltrados = equipos.filter((eq) => {
    const coincideTipo = filtroTipo === 'TODOS' || eq.tipoId === parseInt(filtroTipo);
    const coincideEstado = filtroEstado === 'TODOS' || eq.estado === filtroEstado;
    const coincideTexto = eq.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideEstado && coincideTexto;
  });

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando inventario técnico...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna Izquierda (2/3): Barra de Filtros + Malla de Tarjetas */}
      <div className="lg:col-span-2 space-y-4">
        {/* Barra de Filtros idéntica a tu referencia */}
        <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-3 flex flex-wrap items-center gap-3">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#252528] border border-[#3a3a3f] text-xs text-neutral-200 focus:outline-none"
          >
            <option value="TODOS">Tipo: Todos</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#252528] border border-[#3a3a3f] text-xs text-neutral-200 focus:outline-none"
          >
            <option value="TODOS">Estado: Todos</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="EN_USO">En Uso</option>
            <option value="DANADO">Dañado</option>
            <option value="PERDIDO">Perdido</option>
          </select>

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar equipo..."
            className="flex-1 min-w-[160px] px-3 py-1.5 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#5b73e8]"
          />
        </div>

        {/* Malla de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {equiposFiltrados.map((eq) => (
            <div
              key={eq.id}
              className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-4 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#252528] border border-[#2e2e32] font-mono text-[10px] text-[#788ef5]">
                    EQ-{String(eq.id).padStart(3, '0')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      eq.estado === 'DISPONIBLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : eq.estado === 'DANADO' || eq.estado === 'PERDIDO'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {eq.estado.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">
                  {eq.nombre}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {eq.tipoEquipo?.nombre} • Reposición: ${Number(eq.valorReposicion || 0).toLocaleString('es-CL')}
                </p>
              </div>

              {/* Botones inferiores Editar y Eliminar */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#2e2e32]">
                <button
                  onClick={() => seleccionarParaEditar(eq)}
                  className="flex-1 py-1.5 rounded bg-[#252528] hover:bg-[#2e2e32] border border-[#3a3a3f] text-[11px] font-bold uppercase tracking-wider text-neutral-200 transition-colors"
                >
                  EDITAR
                </button>
                <button
                  onClick={() => handleEliminar(eq.id)}
                  title="Eliminar equipo"
                  className="p-1.5 rounded bg-[#252528] hover:bg-rose-500/20 border border-[#3a3a3f] hover:border-rose-500/40 text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Columna Derecha (1/3): Panel Crear / Editar Equipo */}
      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {editandoId ? `EDITAR EQ-${String(editandoId).padStart(3, '0')}` : 'CREAR EQUIPO'}
          </h2>
          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="text-[11px] text-neutral-400 hover:text-white"
            >
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
              Nombre del Equipo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: CINEMA LINE FX9"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Categoría
            </label>
            <select
              value={tipoId}
              onChange={(e) => setTipoId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Estado
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              <option value="DISPONIBLE">DISPONIBLE</option>
              <option value="EN_USO">EN USO</option>
              <option value="DANADO">DAÑADO</option>
              <option value="PERDIDO">PERDIDO</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Valor Reposición ($)
            </label>
            <input
              type="number"
              value={valorReposicion}
              onChange={(e) => setValorReposicion(e.target.value)}
              placeholder="Ej: 1500000"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <Boton type="submit" disabled={guardando} className="w-full py-2.5">
            {guardando ? 'Guardando...' : editandoId ? 'Actualizar Equipo' : 'Guardar Equipo'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
