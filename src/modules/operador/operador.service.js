import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const operadorService = {
  async listar() {
    return await prisma.operador.findMany();
  },

  async obtenerPorId(id) {
    const operador = await prisma.operador.findUnique({
      where: { id: parseInt(id) },
    });

    if (!operador) {
      throw new AppError(404, 'Operador no encontrado.');
    }

    return operador;
  },

  async crear(datos) {
    return await prisma.operador.create({
      data: datos,
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    return await prisma.operador.update({
      where: { id: parseInt(id) },
      data: datos,
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    await prisma.operador.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },
};
