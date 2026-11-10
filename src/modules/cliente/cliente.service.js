import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const clienteService = {
  async listar() {
    return await prisma.cliente.findMany();
  },

  async obtenerPorId(id) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cliente) {
      throw new AppError(404, `El cliente con ID ${id} no existe en el sistema.`);
    }

    return cliente;
  },

  async crear(datos) {
    return await prisma.cliente.create({
      data: datos,
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    return await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: datos,
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    await prisma.cliente.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },
};
