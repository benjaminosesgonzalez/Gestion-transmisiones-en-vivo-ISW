import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Boton } from '../components/ui/Boton.jsx';

export const KitsPage = () => {
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  const [nombreKit, setNombreKit] = useState('');
  const [descripcionKit, setDescripcionKit] = useState('');
  const [seleccionados, setSeleccionados] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    try {
      const [resEquipos, resTipos, resKits] = await Promise.all([
        api.get('/equipos'),
        api.get('/tipos-equipo'),
        api.get('/kits'),
      ]);
      setEquipos(resEquipos.data || []);
      setCategorias(resTipos.data || []);
      setKits(resKits.data || []);
    } catch (error) {
      console.error('Error al cargar datos de kits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const agregarEquipo = (equipo) => {
    if (equipo.estado !== 'DISPONIBLE') return;

    setSeleccionados((prev) => {
      const yaExiste = prev.some((i) => i.equipoId === equipo.id);
      if (yaExiste) {
        setMensaje({
          tipo: 'error',
          texto: `El equipo "${equipo.nombre}" (EQ-${String(equipo.id).padStart(3, '0')}) es una pieza física única y ya está en el kit.`,
        });
        return prev;
      }
      setMensaje({ tipo: '', texto: '' });
      return [
        ...prev,
        {
          equipoId: equipo.id,
          nombre: equipo.nombre,
          categoria: equipo.tipoEquipo?.nombre,
          cantidad: 1,
        },
      ];
    });
  };

  const quitarEquipo = (equipoId) => {
    setSeleccionados((prev) => prev.filter((i) => i.equipoId !== equipoId));
    setMensaje({ tipo: '', texto: '' });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('equipoId'));
    const eq = equipos.find((item) => item.id === id);
    if (eq) agregarEquipo(eq);
  };

  const handleGuardarKit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!nombreKit.trim() || seleccionados.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Ingresa un nombre y añade al menos un equipo al kit.' });
      return;
    }

    setGuardando(true);
    try {
      const resKit = await api.post('/kits', {
        nombre: nombreKit.trim(),
        descripcion: descripcionKit.trim() || null,
      });

      await api.post(`/kits/${resKit.data.id}/equipos`, {
        equipos: seleccionados.map((s) => ({ equipoId: s.equipoId, cantidad: 1 })),
      });

      setMensaje({ tipo: 'exito', texto: 'Kit configurado y guardado exitosamente.' });
      setNombreKit('');
      setDescripcionKit('');
      setSeleccionados([]);
      cargarDatos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al guardar la configuración del kit.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarKit = async (id) => {
    if (!window.confirm('¿Eliminar este Kit?')) return;
    try {
      await api.delete(`/kits/${id}`);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || 'No se puede eliminar: el kit está asignado a un evento.');
    }
  };

  const equiposFiltrados = equipos.filter((eq) => {
    const coincideTipo = filtroTipo === 'TODOS' || eq.tipoId === parseInt(filtroTipo);
    const coincideEstado = filtroEstado === 'TODOS' || eq.estado === filtroEstado;
    const coincideTexto = eq.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideEstado && coincideTexto;
  });

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando configurador de kits...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
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

        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
            EQUIPOS EN INVENTARIO ({equiposFiltrados.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {equiposFiltrados.map((eq) => {
              const disponible = eq.estado === 'DISPONIBLE';
              const yaSeleccionado = seleccionados.some((s) => s.equipoId === eq.id);
              const habilitado = disponible && !yaSeleccionado;

              return (
                <div
                  key={eq.id}
                  draggable={habilitado}
                  onDragStart={(e) => e.dataTransfer.setData('equipoId', eq.id.toString())}
                  onClick={() => habilitado && agregarEquipo(eq)}
                  className={`bg-[#1c1c1e] border rounded-lg p-3.5 flex items-center justify-between transition-all ${
                    yaSeleccionado
                      ? 'border-[#5b73e8] bg-[#222536] opacity-80 cursor-default'
                      : disponible
                      ? 'border-[#2e2e32] cursor-grab hover:border-[#5b73e8]/60 active:cursor-grabbing'
                      : 'border-[#2e2e32] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#788ef5]">
                      EQ-{String(eq.id).padStart(3, '0')} • {eq.tipoEquipo?.nombre}
                    </span>
                    <p className="text-xs font-bold text-white uppercase mt-0.5">{eq.nombre}</p>
                  </div>

                  {yaSeleccionado ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#5b73e8]/20 text-[#788ef5] border border-[#5b73e8]/40">
                      EN EL KIT
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        disponible
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {eq.estado.replace('_', ' ')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
            KITS CONFIGURADOS ({kits.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kits.map((kit) => (
              <div key={kit.id} className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-white uppercase">{kit.nombre}</h3>
                    <p className="text-[11px] text-neutral-400">{kit.descripcion || 'Sin descripción'}</p>
                  </div>
                  <button
                    onClick={() => handleEliminarKit(kit.id)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#2e2e32]">
                  {(kit.kitEquipos || []).map((ke) => (
                    <span
                      key={ke.equipoId}
                      className="px-2 py-0.5 rounded bg-[#252528] border border-[#3a3a3f] text-[10px] text-neutral-300"
                    >
                      EQ-{String(ke.equipoId).padStart(3, '0')} • {ke.equipo?.nombre}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4"
      >
        <div className="border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">CREAR KIT</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">Selecciona piezas únicas para armar un kit</p>
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

        <form onSubmit={handleGuardarKit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Nombre del Kit
            </label>
            <input
              type="text"
              value={nombreKit}
              onChange={(e) => setNombreKit(e.target.value)}
              placeholder="Ej: KIT AUD-05"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Descripción
            </label>
            <input
              type="text"
              value={descripcionKit}
              onChange={(e) => setDescripcionKit(e.target.value)}
              placeholder="Ej: Nivel Alto (Avanzado)"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="min-h-[180px] border border-dashed border-[#3a3a3f] rounded-lg p-3 flex flex-col justify-between bg-[#18181a]/50">
            {seleccionados.length === 0 ? (
              <div className="my-auto text-center text-xs text-neutral-500 py-8">
                Arrastra equipos para añadirlos al kit
              </div>
            ) : (
              <div className="space-y-2">
                {seleccionados.map((item) => (
                  <div
                    key={item.equipoId}
                    className="flex items-center justify-between bg-[#252528] border border-[#3a3a3f] px-3 py-2 rounded"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">
                        <span className="font-mono text-[#788ef5] mr-1.5">
                          EQ-{String(item.equipoId).padStart(3, '0')}
                        </span>
                        {item.nombre}
                      </p>
                      <p className="text-[10px] text-neutral-400 uppercase">{item.categoria}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => quitarEquipo(item.equipoId)}
                      className="text-neutral-400 hover:text-rose-400 font-bold text-xs px-1.5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Boton type="submit" disabled={guardando} className="w-full py-2.5">
            {guardando ? 'Guardando...' : 'Guardar Configuración'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
