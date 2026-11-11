import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const cargarClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data || []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const limpiar = () => {
    setEditandoId(null);
    setNombre('');
    setRut('');
    setRazonSocial('');
    setTelefono('');
    setDireccion('');
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    if (!nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre del cliente es obligatorio.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        rut: rut.trim() || null,
        razonSocial: razonSocial.trim() || null,
        telefono: telefono.trim() || null,
        direccion: direccion.trim() || null,
      };

      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, payload);
        setMensaje({ tipo: 'exito', texto: 'Cliente actualizado.' });
      } else {
        await api.post('/clientes', payload);
        setMensaje({ tipo: 'exito', texto: 'Cliente registrado exitosamente.' });
      }
      limpiar();
      cargarClientes();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error al guardar cliente.' });
    } finally {
      setGuardando(false);
    }
  };

  const columnas = [
    {
      header: 'CLIENTE / EMPRESA',
      render: (row) => (
        <div>
          <p className="font-bold text-white uppercase">{row.nombre}</p>
          <span className="text-[11px] text-neutral-500">{row.razonSocial || 'Sin razón social'}</span>
        </div>
      ),
    },
    { header: 'RUT', render: (row) => <span className="font-mono text-neutral-300">{row.rut || '--'}</span> },
    { header: 'TELÉFONO', render: (row) => <span className="text-neutral-300">{row.telefono || '--'}</span> },
    { header: 'DIRECCIÓN', render: (row) => <span className="text-neutral-400">{row.direccion || '--'}</span> },
    {
      header: 'ACCIONES',
      render: (row) => (
        <button
          onClick={() => {
            setEditandoId(row.id);
            setNombre(row.nombre);
            setRut(row.rut || '');
            setRazonSocial(row.razonSocial || '');
            setTelefono(row.telefono || '');
            setDireccion(row.direccion || '');
            setMensaje({ tipo: '', texto: '' });
          }}
          className="px-2.5 py-1 rounded bg-[#252528] hover:bg-[#2e2e32] border border-[#3a3a3f] text-[10px] font-bold uppercase text-neutral-200"
        >
          EDITAR
        </button>
      ),
    },
  ];

  if (loading) return <div className="text-xs text-neutral-400 animate-pulse">Cargando clientes...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">CARTERA DE CLIENTES ({clientes.length})</h1>
        <DataTable columns={columnas} data={clientes} emptyMessage="No hay clientes registrados." />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {editandoId ? 'EDITAR CLIENTE' : 'NUEVO CLIENTE'}
          </h2>
          {editandoId && (
            <button type="button" onClick={limpiar} className="text-[11px] text-neutral-400 hover:text-white">Cancelar</button>
          )}
        </div>

        {mensaje.texto && (
          <div className={`p-3 rounded text-xs border ${mensaje.tipo === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleGuardar} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Nombre Comercial</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">RUT</label>
              <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-neutral-400">Teléfono</label>
              <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Razón Social</label>
            <input type="text" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Dirección</label>
            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]" />
          </div>
          <Boton type="submit" disabled={guardando} className="w-full py-2.5">
            {guardando ? 'Guardando...' : editandoId ? 'ACTUALIZAR CLIENTE' : 'GUARDAR CLIENTE'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
