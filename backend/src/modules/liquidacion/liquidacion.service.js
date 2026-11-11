import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const liquidacionService = {
  async listarLiquidaciones() {
    return await prisma.distribucionPago.findMany({
      include: { evento: true, operador: true, perdida: true },
      orderBy: { fechaDistribucion: 'desc' },
    });
  },

    async listarIncidentes() {
    return await prisma.perdida.findMany({
      include: { evento: true, equipo: true },
      orderBy: { fecha: 'desc' },
    });
  },
  
  // --- REGISTRAR DAÑO O PÉRDIDA EN UN EVENTO ---
  async registrarPerdida(datos) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verificar que el equipo y el evento existan
      const equipo = await tx.equipo.findUnique({ where: { id: datos.equipoId } });
      if (!equipo) throw new AppError(404, 'El equipo especificado no existe.');

      // 2. Cambiar dinámicamente el estado del equipo en el catálogo a DANADO por defecto en el incidente
      await tx.equipo.update({
        where: { id: datos.equipoId },
        data: { estado: 'DANADO' },
      });

      // 3. Crear la fila en la tabla de Pérdidas
      return await tx.perdida.create({
        data: datos,
        include: { equipo: true, evento: true },
      });
    });
  },

  // --- EMITIR LIQUIDACIÓN DE PAGO A OPERADOR ---
  async liquidarOperador(datos) {
    const { eventoId, operadorId, perdidaId, monto, porcentaje, fechaDistribucion, estado } = datos;

    // Validar existencias de las entidades relacionadas
    const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
    if (!evento) throw new AppError(404, 'El evento especificado no existe.');

    const operador = await prisma.operador.findUnique({ where: { id: operadorId } });
    if (!operador) throw new AppError(404, 'El operador especificado no existe.');

    let montoFinalConDescuento = monto;

    // Si viene amarrada una pérdida, calculamos el descuento automático al egreso del operador
    if (perdidaId) {
      const perdida = await prisma.perdida.findUnique({ where: { id: perdidaId } });
      if (!perdida) throw new AppError(404, 'El registro de pérdida asociado no existe.');
      
      // Aplicamos el descuento al monto original del pago
      montoFinalConDescuento = Math.max(0, monto - parseFloat(perdida.monto));
    }

    return await prisma.distribucionPago.create({
      data: {
        eventoId,
        operadorId,
        perdidaId,
        monto: montoFinalConDescuento,
        porcentaje,
        fechaDistribucion,
        estado,
      },
      include: { evento: true, operador: true, perdida: true },
    });
  },
};
