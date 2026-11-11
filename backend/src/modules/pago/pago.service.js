import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const pagoService = {
  // Lista todos los eventos con sus pagos y abonos consolidados para la tabla del Contador
  async listarPagosEventos() {
    const eventos = await prisma.evento.findMany({
      where: { estado: { not: 'CANCELADO' } },
      include: {
        cliente: true,
        pagos: {
          include: { abonos: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    return eventos.map((ev) => {
      const totalEvento = Number(ev.valorTotal || 0);
      let totalAbonado = 0;

      ev.pagos.forEach((p) => {
        p.abonos.forEach((ab) => {
          totalAbonado += Number(ab.monto || 0);
        });
      });

      const pendiente = Math.max(0, totalEvento - totalAbonado);
      const tieneGarantiaPendiente = ev.pagos.some(
        (p) => p.tipoPago === 'ANTICIPO' && p.estadoPago === 'PENDIENTE'
      );

      let estadoConsolidado = 'PENDIENTE';
      if (pendiente === 0 && totalEvento > 0) {
        estadoConsolidado = 'PAGADO';
      } else if (tieneGarantiaPendiente && totalAbonado === 0) {
        estadoConsolidado = 'GARANTIA';
      }

      return {
        eventoId: ev.id,
        eventoNombre: ev.nombre,
        clienteNombre: ev.cliente?.nombre || 'Sin cliente',
        total: totalEvento,
        abonado: totalAbonado,
        pendiente,
        estado: estadoConsolidado,
        pagos: ev.pagos,
      };
    });
  },

  // Registra un abono real y actualiza el estado del pago automáticamente
  async registrarAbono(datos, comprobanteUrl = null) {
    const { eventoId, monto, fechaPago, metodoPago, notas } = datos;

    return await prisma.$transaction(async (tx) => {
      const evento = await tx.evento.findUnique({
        where: { id: eventoId },
        include: { pagos: { include: { abonos: true } } },
      });

      if (!evento) throw new AppError(404, 'El evento especificado no existe.');

      // Si el evento no tenía registro de Pago (ej. duró <= 5 hrs), creamos el Pago base
      let pagoDestino = evento.pagos.find((p) => p.estadoPago === 'PENDIENTE') || evento.pagos;

      if (!pagoDestino) {
        pagoDestino = await tx.pago.create({
          data: {
            eventoId: evento.id,
            montoTotal: evento.valorTotal,
            tipoPago: 'SALDO_TOTAL',
            estadoPago: 'PENDIENTE',
            fechaEsperada: evento.fecha,
          },
          include: { abonos: true },
        });
      }

      // Crear el abono vinculado
      const nuevoAbono = await tx.pagoAbono.create({
        data: {
          pagoId: pagoDestino.id,
          monto,
          fechaPago,
          metodoPago,
          comprobanteUrl,
          notas,
        },
      });

      // Recalcular si la deuda total del evento ya quedó saldada
      const abonosPrevios = evento.pagos.reduce(
        (acc, p) => acc + p.abonos.reduce((s, a) => s + Number(a.monto || 0), 0),
        0
      );
      const nuevoTotalAbonado = abonosPrevios + monto;

      if (nuevoTotalAbonado >= Number(evento.valorTotal)) {
        await tx.pago.updateMany({
          where: { eventoId: evento.id },
          data: { estadoPago: 'PAGADO' },
        });
      }

      return nuevoAbono;
    });
  },
};
