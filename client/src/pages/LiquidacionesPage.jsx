import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Boton } from '../components/ui/Boton.jsx';

export const LiquidacionesPage = () => {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario de Liquidación
  const [eventoId, setEventoId] = useState('');
  const [operadorId, setOperadorId] = useState('');
  const [perdidaId, setPerdidaId] = useState('');
  const [tipoCalculo, setTipoCalculo] = useState('FIJO'); // 'FIJO' | 'PORCENTAJE'
  const [montoBruto, setMontoBruto] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [fechaDistribucion, setFechaDistribucion] = useState(new Date().toISOString().split('T')[0]);
  const [estado, setEstado] = useState('LIQUIDADO');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const cargarDatos = async () => {
    try {
      const [resLiq, resEv, resOps, resInc] = await Promise.all([
        api.get('/liquidaciones'),
        api.get('/eventos'),
        api.get('/operadores'),
        api.get('/liquidaciones/incidentes'),
      ]);

      const listaEv = resEv.data || [];
      const listaOps = resOps.data || [];

      setLiquidaciones(resLiq.data || []);
      setEventos(listaEv);
      setOperadores(listaOps);
      setIncidentes(resInc.data || []);

      if (listaEv.length > 0 && !eventoId) setEventoId(listaEv[0].id.toString());
      if (listaOps.length > 0 && !operadorId) setOperadorId(listaOps[0].id.toString());
    } catch (error) {
      console.error('Error al cargar liquidaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Obtener datos financieros del evento seleccionado para calcular utilidad neta en tiempo real
  const eventoSeleccionado = eventos.find((e) => e.id === parseInt(eventoId));
  const totalEvento = Number(eventoSeleccionado?.valorTotal || 0);
  const totalGastosEvento = (eventoSeleccionado?.gastos || []).reduce(
    (acc, g) => acc + Number(g.monto || 0),
    0
  );
  // Regla del Product Owner: restar obligatoriamente los gastos vinculados al evento
  const utilidadNetaEvento = Math.max(0, totalEvento - totalGastosEvento);

  // Incidentes de pérdida vinculados al evento seleccionado
  const incidentesDelEvento = incidentes.filter((inc) => inc.eventoId === parseInt(eventoId));
  const incidenteSeleccionado = incidentesDelEvento.find((inc) => inc.id === parseInt(perdidaId));
  const descuentoPerdida = Number(incidenteSeleccionado?.monto || 0);

  // Cálculo en tiempo real del pago antes y después de descuentos
  const montoCalculadoBase =
    tipoCalculo === 'PORCENTAJE'
      ? Math.round((utilidadNetaEvento * Number(porcentaje || 0)) / 100)
      : Number(montoBruto || 0);

  const montoNetoAPagar = Math.max(0, montoCalculadoBase - descuentoPerdida);

  const handleEmitirLiquidacion = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (!eventoId || !operadorId || montoCalculadoBase <= 0) {
      setMensaje({ tipo: 'error', texto: 'Selecciona evento, operador e ingresa un monto o porcentaje válido.' });
      return;
    }

    setGuardando(true);
    try {
      await api.post('/liquidaciones/operador', {
        eventoId: parseInt(eventoId),
        operadorId: parseInt(operadorId),
        perdidaId: perdidaId ? parseInt(perdidaId) : null,
        monto: montoCalculadoBase, // El backend descuenta la pérdida automáticamente si va perdidaId
        porcentaje: tipoCalculo === 'PORCENTAJE' ? Number(porcentaje) : null,
        fechaDistribucion,
        estado,
      });

      setMensaje({
        tipo: 'exito',
        texto: 'Liquidación registrada como EGRESO oficial en el sistema.',
      });
      setMontoBruto('');
      setPorcentaje('');
      setPerdidaId('');
      cargarDatos();
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.message || 'Error al procesar la liquidación.',
      });
    } finally {
      setGuardando(false);
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
      header: 'OPERADOR',
      render: (row) => <span className="font-semibold text-white">{row.operador?.nombre}</span>,
    },
    {
      header: 'MODALIDAD',
      render: (row) => (
        <span className="text-neutral-400 text-[11px]">
          {row.porcentaje ? `${row.porcentaje}% Utilidad` : 'Monto Fijo'}
        </span>
      ),
    },
    {
      header: 'DESCUENTO PÉRDIDA',
      render: (row) =>
        row.perdida ? (
          <span className="text-rose-400 font-mono text-[11px]">
            -${Number(row.perdida.monto).toLocaleString('es-CL')}
          </span>
        ) : (
          <span className="text-neutral-500 text-[11px]">$0</span>
        ),
    },
    {
      header: 'EGRESO NETO',
      render: (row) => (
        <span className="font-bold text-white">
          ${Number(row.monto || 0).toLocaleString('es-CL')}
        </span>
      ),
    },
    {
      header: 'ESTADO',
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
            row.estado === 'LIQUIDADO'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : row.estado === 'RETENIDO'
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }`}
        >
          {row.estado}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div className="text-xs text-neutral-400 animate-pulse">Cargando historial de liquidaciones...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna Izquierda (2/3): Tabla Historial de Egresos a Operadores */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold tracking-wider text-white uppercase">
            LIQUIDACIONES Y EGRESOS A OPERADORES ({liquidaciones.length})
          </h1>
        </div>

        <DataTable
          columns={columnas}
          data={liquidaciones}
          emptyMessage="No hay liquidaciones de operadores registradas."
        />
      </div>

      {/* Columna Derecha (1/3): Panel Desglose y Pago a Operador */}
      <div className="bg-[#1c1c1e] border border-[#2e2e32] rounded-lg p-5 h-fit space-y-4">
        <div className="border-b border-[#2e2e32] pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">Liquidar Operador</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Registra el pago como egreso oficial aplicando descuentos si existen
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

        <form onSubmit={handleEmitirLiquidacion} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Evento a Liquidar
            </label>
            <select
              value={eventoId}
              onChange={(e) => {
                setEventoId(e.target.value);
                setPerdidaId('');
              }}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  EVT-{String(ev.id).padStart(4, '0')} - {ev.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Resumen de Rentabilidad Real del Evento (Restando Gastos) */}
          {eventoSeleccionado && (
            <div className="p-3 rounded bg-[#18181a] border border-[#2e2e32] space-y-1 text-[11px]">
              <div className="flex justify-between text-neutral-400">
                <span>Valor Evento:</span>
                <span>${totalEvento.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Gastos Imputados:</span>
                <span>-${totalGastosEvento.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-400 border-t border-[#2e2e32] pt-1">
                <span>Utilidad Neta Base:</span>
                <span>${utilidadNetaEvento.toLocaleString('es-CL')}</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Operador
            </label>
            <select
              value={operadorId}
              onChange={(e) => setOperadorId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              {operadores.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Modalidad: Monto Fijo o Porcentaje */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipoCalculo('FIJO')}
              className={`py-1.5 rounded text-[10px] font-bold uppercase border transition-colors ${
                tipoCalculo === 'FIJO'
                  ? 'bg-[#5b73e8]/20 text-[#788ef5] border-[#5b73e8]'
                  : 'bg-[#18181a] text-neutral-400 border-[#2e2e32]'
              }`}
            >
              MONTO FIJO ($)
            </button>
            <button
              type="button"
              onClick={() => setTipoCalculo('PORCENTAJE')}
              className={`py-1.5 rounded text-[10px] font-bold uppercase border transition-colors ${
                tipoCalculo === 'PORCENTAJE'
                  ? 'bg-[#5b73e8]/20 text-[#788ef5] border-[#5b73e8]'
                  : 'bg-[#18181a] text-neutral-400 border-[#2e2e32]'
              }`}
            >
              % UTILIDAD NETA
            </button>
          </div>

          {tipoCalculo === 'FIJO' ? (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Monto Bruto a Pagar (CLP)
              </label>
              <input
                type="number"
                value={montoBruto}
                onChange={(e) => setMontoBruto(e.target.value)}
                placeholder="$ 0"
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Porcentaje sobre Utilidad Neta (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                placeholder="Ej: 20"
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
            </div>
          )}

          {/* Asociar Incidente de Pérdida (Opcional) */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Descontar Pérdida / Daño (Opcional)
            </label>
            <select
              value={perdidaId}
              onChange={(e) => setPerdidaId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
            >
              <option value="">Ningún descuento aplicado</option>
              {incidentesDelEvento.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.equipo?.nombre} (-${Number(inc.monto).toLocaleString('es-CL')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Fecha Pago
              </label>
              <input
                type="date"
                value={fechaDistribucion}
                onChange={(e) => setFechaDistribucion(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#18181a] border border-[#2e2e32] text-xs text-white focus:outline-none focus:border-[#5b73e8]"
              />
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
                <option value="LIQUIDADO">LIQUIDADO</option>
                <option value="APROBADO">APROBADO</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="RETENIDO">RETENIDO</option>
              </select>
            </div>
          </div>

          {/* Total Neto Final calculado */}
          <div className="flex justify-between items-center p-3 rounded bg-[#18181a] border border-[#2e2e32]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Total Neto Egreso:
            </span>
            <span className="text-sm font-bold text-white">
              ${montoNetoAPagar.toLocaleString('es-CL')}
            </span>
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full py-2.5 rounded bg-[#5b73e8] text-xs font-bold text-white hover:bg-[#4b63d8] disabled:opacity-50"
          >
            {guardando ? 'Procesando...' : 'REGISTRAR LIQUIDACIÓN'}
          </button>
        </form>
      </div>
    </div>
  );
};