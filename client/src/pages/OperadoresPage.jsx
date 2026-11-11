import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const OperadoresPage = () => {
  const [operadores, setOperadores] = useState([]);
  const [funcionesCatalogo, setFuncionesCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('ACTIVO');
  const [funcionesSeleccionadas, setFuncionesSeleccionadas] = useState([]);

  const cargarDatos = async () => {
    try {
      const [resOps, resFunc] = await Promise.all([
        api.get('/operadores'),
        api.get('/funciones'),
      ]);
      setOperadores(resOps.data || []);
      setFuncionesCatalogo(resFunc.data || []);
    } catch (error) {
      console.error('Error al cargar operadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleFuncion = (id) => {
    setFuncionesSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setRut('');
    setTelefono('');
    setEmail('');
    setEstado('ACTIVO');
    setFuncionesSeleccionadas([]);
  };

  const seleccionarEditar = (op) => {
    setEditandoId(op.id);
    setNombre(op.nombre);
    setRut(op.rut || '');
    setTelefono(op.telefono || '');
    setEmail(op.email || '');
    setEstado(op.estado);
    setFuncionesSeleccionadas((op.funciones || []).map((f) => f.funcionId));
    setMensaje({ tipo: '', texto: '' });
  };

  const handleGuardarOperador = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre del operador es obligatorio.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        rut: rut.trim() || null,
        telefono: telefono.trim() || null,
        email: email.trim() || null,
        estado,
      };

      let opId = editandoId;
      if (editandoId) {
        await api.put(`/operadores/${editandoId}`, payload);
      } else {
        const resNuevo = await api.post('/operadores', payload);
        opId = resNuevo.data.id;
      }

      if (funcionesSeleccionadas.length > 0) {
        await api.post(`/operadores/${opId}/funciones`, {
          funcionIds: funcionesSeleccionadas,
        });
      }

      setMensaje({
        tipo: 'exito',
        texto: editandoId ? 'Operador actualizado correctamente.' : 'Operador registrado correctamente.',
      });
      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al guardar operador.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const columnas = [
    {
      header: 'OPERADOR',
      render: (row) => (
        <div>
          <p className="font-bold text-white">{row.nombre}</p>
          <span className="text-[11px] text-neutral-500">
            {row.rut || 'Sin RUT'} • {row.telefono || 'Sin teléfono'}
          </span>
        </div>
      ),
    },
    {
      header: 'FUNCIONES HABILITADAS',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.funciones || []).length === 0 ? (
            <span className="text-[11px] text-neutral-500">Sin asignar</span>
          ) : (
            row.funciones.map((f) => (
              <span
                key={f.funcionId}
                className="px-2 py-0.5 rounded bg-[#252528] border border-[#3a3a3f] text-[10px] font-semibold text-[#788ef5]"
              >
                {f.funcion?.nombre}
              </span>
            ))
          )}
        </div>
      ),
    },
    {
      header: 'ESTADO',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
            row.estado === 'ACTIVO'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
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

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando operadores...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          OPERADORES Y ESPECIALIDADES ({operadores.length})
        </h1>
        <DataTable columns={columnas} data={operadores} emptyMessage="No hay operadores registrados." />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {editandoId ? 'EDITAR OPERADOR' : 'CREAR OPERADOR'}
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

        <form onSubmit={handleGuardarOperador} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Carlos Mendoza"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">RUT</label>
              <input
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="18.123.456-7"
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="op@correo.com"
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+569..."
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">
              Funciones Habilitadas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {funcionesCatalogo.map((fn) => {
                const activa = funcionesSeleccionadas.includes(fn.id);
                return (
                  <button
                    key={fn.id}
                    type="button"
                    onClick={() => toggleFuncion(fn.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border transition-colors ${
                      activa
                        ? 'bg-[#5b73e8]/20 text-[#788ef5] border-[#5b73e8]'
                        : 'bg-[#18181a] text-neutral-400 border-[#2e2e32]'
                    }`}
                  >
                    {fn.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full px-3 py-2.5 rounded bg-[#5b73e8] hover:bg-[#6d82f2] text-[10px] font-bold uppercase tracking-wide text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {guardando ? 'Guardando...' : editandoId ? 'ACTUALIZAR OPERADOR' : 'GUARDAR OPERADOR'}
          </button>
        </form>
      </div>
    </div>
  );
};