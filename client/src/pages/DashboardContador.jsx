import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const DashboardContador = () => {
  const [pagosEventos, setPagosEventos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [loading, setLoading] = useState(true);

  // Estados del formulario Registrar Abono
  const [eventoId, setEventoId] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [metodoPago, setMetodoPago] = useState('TRANSFERENCIA');
  const [notas, setNotas] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarPagos = async () => {
    try {
      const res = await api.get('/pagos');
      const lista = res.data || [];
      setPagosEventos(lista);
      if (lista.length > 0 && !eventoId) {
        setEventoId(lista[0].eventoId.toString());
      }
    } catch (error) {
      console.error('Error al cargar pagos de eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  const limpiarFormulario = () => {
    setMonto('');
    setNotas('');
    setArchivo(null);
    setMetodoPago('TRANSFERENCIA');
    setFechaPago(new Date().toISOString().split('T')[0]);
  };

  const handleProcesarAbono = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!eventoId || !monto || Number(monto) <= 0) {
      setMensaje({ tipo: 'error', texto: 'Selecciona un evento e ingresa un monto válido.' });
      return;
    }

    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append('eventoId', eventoId);
      formData.append('monto', monto);
      formData.append('fechaPago', fechaPago);
      formData.append('metodoPago', metodoPago);
      if (notas.trim()) formData.append('notas', notas.trim());
      if (archivo) formData.append('comprobante', archivo);

      await api.post('/pagos/abonos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMensaje({ tipo: 'exito', texto: 'Abono procesado y registrado exitosamente.' });
      limpiarFormulario();
      cargarPagos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al procesar el abono.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const pagosFiltrados = pagosEventos.filter(
    (p) => filtroEstado === 'TODOS' || p.estado === filtroEstado
  );
  const columnas = [
    {
      header: 'EVENTO',
      render: (row) => (
        <span className="font-bold text-[#788ef5] uppercase tracking-wide">
          {row.eventoNombre}
        </span>
      ),
    },
    {
      header: 'CLIENTE',
      render: (row) => (
        <span className="text-neutral-200 font-semibold uppercase">{row.clienteNombre}</span>
      ),
    },
    {
      header: 'TOTAL',
      render: (row) => (
        <span className="font-bold text-white">${row.total.toLocaleString('es-CL')}</span>
      ),
    },
    {
      header: 'ABONADO',
      render: (row) => (
        <span className="font-bold text-white">${row.abonado.toLocaleString('es-CL')}</span>
      ),
    },
    {
      header: 'PENDIENTE',
      render: (row) => (
        <span className={`font-bold ${row.pendiente > 0 ? 'text-amber-400' : 'text-neutral-300'}`}>
          ${row.pendiente.toLocaleString('es-CL')}
        </span>
      ),
    },
    {
      header: 'ESTADO',
      render: (row) => {
        const estilos = {
          PAGADO: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          PENDIENTE: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          GARANTIA: 'bg-[#5b73e8]/15 text-[#788ef5] border-[#5b73e8]/30',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${estilos[row.estado] || estilos.PENDIENTE}`}>
            {row.estado}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando pagos de eventos...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna Izquierda (2/3): Tabla PAGOS DE EVENTOS */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold tracking-wider text-white uppercase">
            PAGOS DE EVENTOS
          </h1>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#5b73e8] text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none"
          >
            <option value="TODOS">FILTRO: TODOS</option>
            <option value="PAGADO">PAGADO</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="GARANTIA">GARANTÍA</option>
          </select>
        </div>

        <DataTable
          columns={columnas}
          data={pagosFiltrados}
          emptyMessage="No hay eventos registrados con pagos."
        />
      </div>

      {/* Columna Derecha (1/3): Panel + Registrar Abono */}
      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="flex items-center gap-2 border-b border-[#2e2e32] pb-3 text-white">
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-base font-bold tracking-tight">Registrar Abono</h2>
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

        <form onSubmit={handleProcesarAbono} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              EVENTO / REFERENCIA
            </label>
            <select
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {pagosEventos.map((ev) => (
                <option key={ev.eventoId} value={ev.eventoId}>
                  EVT-{String(ev.eventoId).padStart(4, '0')} - {ev.eventoNombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              MONTO A ABONAR (CLP)
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="$ 0"
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                FECHA
              </label>
              <input
                type="date"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                MÉTODO
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              >
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          {/* Zona de Carga de Comprobante */}
          <label className="block border border-dashed border-[#3a3a3f] hover:border-[#5b73e8] rounded-lg p-5 text-center cursor-pointer bg-[#18181a]/50 transition-colors">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setArchivo(e.target.files[0] || null)}
              className="hidden"
            />
            <svg className="w-6 h-6 mx-auto text-neutral-400 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[11px] font-bold text-neutral-200 uppercase">
              {archivo ? archivo.name : 'CARGAR COMPROBANTE'}
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              PDF, JPG o PNG (Max 5MB)
            </p>
          </label>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              NOTAS / COMENTARIOS
            </label>
            <textarea
              rows="2"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Referencia de transferencia..."
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Boton type="button" variant="secondary" onClick={limpiarFormulario} className="w-full py-2.5">
              CANCELAR
            </Boton>
            <Boton type="submit" disabled={guardando} className="w-full py-2.5">
              {guardando ? 'Procesando...' : 'PROCESAR ABONO'}
            </Boton>
          </div>
        </form>
      </div>
    </div>
  );
};
