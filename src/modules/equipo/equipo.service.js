import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const equipoService = {
  async listar() {
    return await prisma.equipo.findMany({
      include: { tipoEquipo: true },
      orderBy: { id: 'asc' },
    });
  },

  async obtenerPorId(id) {
    const equipo = await prisma.equipo.findUnique({
      where: { id: parseInt(id) },
      include: { tipoEquipo: true },
    });

    if (!equipo) {
      throw new AppError(404, `El equipo con ID ${id} no existe en el inventario.`);
    }
    return equipo;
  },

  async crear(datos) {
    // Validamos de forma proactiva que la categoría exista antes de asociar el equipo
    const categoriaExiste = await prisma.tipoEquipo.findUnique({
      where: { id: datos.tipoId },
    });
    if (!categoriaExiste) {
      throw new AppError(400, 'La categoría seleccionada para el equipo no es válida.');
    }

    return await prisma.equipo.create({
      data: datos,
      include: { tipoEquipo: true },
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    if (datos.tipoId) {
      const categoriaExiste = await prisma.tipoEquipo.findUnique({
        where: { id: datos.tipoId },
      });
      if (!categoriaExiste) {
        throw new AppError(400, 'La categoría seleccionada no es válida.');
      }
    }

    return await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: datos,
      include: { tipoEquipo: true },
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    // Si el equipo está amarrado a un evento activo o a un kit, Prisma restringe el borrado de forma segura
    await prisma.equipo.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },
};
