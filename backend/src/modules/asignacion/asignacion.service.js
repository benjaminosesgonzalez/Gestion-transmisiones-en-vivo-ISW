import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const asignacionService = {
  async listar() {
    return await prisma.asignacion.findMany({
      include: {
        evento: true,
        operador: true,
        funciones: { include: { funcion: true } },
      },
    });
  },

  async obtenerPorId(id) {
    const asignacion = await prisma.asignacion.findUnique({
      where: { id: parseInt(id) },
      include: {
        evento: true,
        operador: true,
        funciones: { include: { funcion: true } },
      },
    });
    if (!asignacion) throw new AppError(404, 'La asignación solicitada no existe.');
    return asignacion;
  },

  async crear(datos) {
    const { eventoId, operadorId, horaInicio, horaFin, observacion, funcionIds } = datos;

    // 1. Obtener los datos del evento para conocer su fecha real
    const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
    if (!evento) throw new AppError(404, 'El evento especificado no existe.');

    // 2. VALIDACIÓN A: Verificar si el operador tiene una ausencia registrada esa fecha
    const ausencia = await prisma.ausencia.findFirst({
      where: {
        operadorId,
        fechaInicio: { lte: evento.fecha },
        fechaFin: { gte: evento.fecha },
      },
    });
    if (ausencia) {
      throw new AppError(409, `El operador seleccionado no está disponible por ausencia: ${ausencia.motivo || 'Sin motivo'}`);
    }

    // 3. VALIDACIÓN B: Verificar solapamientos de horarios en la misma fecha
    const solapamiento = await prisma.asignacion.findFirst({
      where: {
        operadorId,
        evento: {
          fecha: evento.fecha,
          estado: { not: 'CANCELADO' }, // Ignoramos eventos cancelados de forma nativa
        },
        AND: [
          { horaInicio: { lt: horaFin } },
          { horaFin: { gt: horaInicio } },
        ],
      },
    });
    if (solapamiento) {
      throw new AppError(409, 'El operador ya se encuentra asignado a otra transmisión en esa misma franja horaria.');
    }

    // 4. Inserción transaccional atómica de la asignación y su tabla intermedia de funciones
    return await prisma.$transaction(async (tx) => {
      const nuevaAsignacion = await tx.asignacion.create({
        data: { eventoId, operadorId, horaInicio, horaFin, observacion },
      });

      await tx.asignacionFuncion.createMany({
        data: funcionIds.map((fId) => ({
          asignacionId: nuevaAsignacion.id,
          funcionId: fId,
        })),
      });

      return await tx.asignacion.findUnique({
        where: { id: nuevaAsignacion.id },
        include: { funciones: { include: { funcion: true } } },
      });
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);
    await prisma.asignacion.delete({ where: { id: parseInt(id) } });
    return true;
  },

  // REGLA DE NEGOCIO C: Liberación automática de operadores por cancelación de eventos
  async liberarPorCancelacion(eventoId) {
    return await prisma.asignacion.deleteMany({
      where: { eventoId: parseInt(eventoId) },
    });
  },
};
