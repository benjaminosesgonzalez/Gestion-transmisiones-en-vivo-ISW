import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const tipoEquipoService = {
  async listar() {
    return await prisma.tipoEquipo.findMany({
      orderBy: { nombre: 'asc' },
    });
  },

  async obtenerPorId(id) {
    const tipo = await prisma.tipoEquipo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tipo) {
      throw new AppError(404, `La categoría de equipo con ID ${id} no existe.`);
    }

    return tipo;
  },

  async crear(datos) {
    // Evitamos duplicidad de nombres en los catálogos maestros
    const existe = await prisma.tipoEquipo.findUnique({
      where: { nombre: datos.nombre },
    });

    if (existe) {
      throw new AppError(409, `La categoría '${datos.nombre}' ya se encuentra registrada.`);
    }

    return await prisma.tipoEquipo.create({
      data: datos,
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    if (datos.nombre) {
      const existe = await prisma.tipoEquipo.findUnique({
        where: { nombre: datos.nombre },
      });
      if (existe && existe.id !== parseInt(id)) {
        throw new AppError(409, `Ya existe otra categoría registrada con el nombre '${datos.nombre}'.`);
      }
    }

    return await prisma.tipoEquipo.update({
      where: { id: parseInt(id) },
      data: datos,
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    // Si existen equipos amarrados a esta categoría, el error referencial (P2003) se gestionará en el errorMiddleware
    await prisma.tipoEquipo.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },
};
