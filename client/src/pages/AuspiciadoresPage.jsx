import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const AuspiciadoresPage = () => {
  const [auspiciadores, setAuspiciadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargar = async () => {
    try {
      const res = await api.get('/auspiciadores');
      setAuspiciadores(res.data || []);
    } catch (error) {
      console.error('Error al cargar auspiciadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiar = () => {
    setEditandoId(null);
    setNombre('');
    setContacto('');
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    if (!nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre del auspiciador es obligatorio.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = { nombre: nombre.trim(), contacto: contacto.trim() || null };
      if (editandoId) {
        await api.put(`/auspiciadores/${editandoId}`, payload);
        setMensaje({ tipo: 'exito', texto: 'Auspiciador actualizado.' });
      } else {
        await api.post('/auspiciadores', payload);
        setMensaje({ tipo: 'exito', texto: 'Auspiciador registrado.' });
      }
      limpiar();
      cargar();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error al guardar.' });
    } finally {
      setGuardando(false);
    }
  };

  const columnas = [
    { header: 'EMPRESA AUSPICIADORA', render: (row) => <span className="font-bold text-white uppercase">{row.nombre}</span> },
    { header: 'CONTACTO / CONVENIO', render: (row) => <span className="text-neutral-300">{row.contacto || '--'}</span> },
    {
      header: 'ACCIONES',
      render: (row) => (
        <button
          onClick={() => {
            setEditandoId(row.id);
            setNombre(row.nombre);
            setContacto(row.contacto || '');
            setMensaje({ tipo: '', texto: '' });
          }}
          className="px-2.5 py-1 rounded bg-[#252528] hover:bg-[#2e2e32] border border-[#3a3a3f] text-[10px] font-bold uppercase text-neutral-200"
        >
          EDITAR
        </button>
      ),
    },
  ];

  if (loading) return <div className="text-xs text-neutral-400 animate-pulse">Cargando auspiciadores...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">EMPRESAS AUSPICIADORAS ({auspiciadores.length})</h1>
        <DataTable columns={columnas} data={auspiciadores} emptyMessage="No hay auspiciadores registrados." />
      </div>

      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {editandoId ? 'EDITAR AUSPICIADOR' : 'NUEVO AUSPICIADOR'}
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

        <form onSubmit={handleGuardar} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Nombre Empresa</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Entel Chile" className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Correo / Teléfono Contacto</label>
            <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="convenios@empresa.cl" className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]" />
          </div>
          <Boton type="submit" disabled={guardando} className="w-full py-2.5">
            {guardando ? 'Guardando...' : editandoId ? 'ACTUALIZAR AUSPICIADOR' : 'GUARDAR AUSPICIADOR'}
          </Boton>
        </form>
      </div>
    </div>
  );
};
