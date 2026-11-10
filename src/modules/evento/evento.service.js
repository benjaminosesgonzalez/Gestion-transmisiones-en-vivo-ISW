import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const eventoService = {
  async listar() {
    return await prisma.evento.findMany({
      include: { cliente: true },
    });
  },

  async obtenerPorId(id) {
    const evento = await prisma.evento.findUnique({
      where: { id: parseInt(id) },
      include: { cliente: true },
    });

    if (!evento) {
      throw new AppError(404, 'El evento solicitado no existe.');
    }

    return evento;
  },

  async crear(datos) {
    return await prisma.evento.create({
      data: datos,
      include: { cliente: true },
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    return await prisma.evento.update({
      where: { id: parseInt(id) },
      data: datos,
      include: { cliente: true },
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    await prisma.evento.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },
};
