import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const gastoService = {
  async listar() {
    return await prisma.gasto.findMany({
      include: { evento: true },
      orderBy: { fecha: 'desc' },
    });
  },

  async obtenerPorId(id) {
    const gasto = await prisma.gasto.findUnique({
      where: { id: parseInt(id) },
      include: { evento: true },
    });

    if (!gasto) {
      throw new AppError(404, `El registro de gasto con ID ${id} no existe.`);
    }
    return gasto;
  },

  async crear(datos) {
    // Validamos que el evento exista antes de meterle un gasto
    const eventoExiste = await prisma.evento.findUnique({
      where: { id: datos.eventoId },
    });
    if (!eventoExiste) {
      throw new AppError(400, 'El evento asociado para este gasto no existe en el sistema.');
    }

    return await prisma.gasto.create({
      data: datos,
      include: { evento: true },
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    if (datos.eventoId) {
      const eventoExiste = await prisma.evento.findUnique({
        where: { id: datos.eventoId },
      });
      if (!eventoExiste) {
        throw new AppError(400, 'El evento asociado especificado no es válido.');
      }
    }

    return await prisma.gasto.update({
      where: { id: parseInt(id) },
      data: datos,
      include: { evento: true },
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    await prisma.gasto.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },
};
