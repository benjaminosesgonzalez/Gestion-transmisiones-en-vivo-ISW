import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const funcionService = {
  async listar() {
    return await prisma.funcion.findMany({
      orderBy: { nombre: 'asc' }, // Mantenemos un orden alfabético visual amigable
    });
  },

  async obtenerPorId(id) {
    const funcion = await prisma.funcion.findUnique({
      where: { id: parseInt(id) },
    });

    if (!funcion) {
      throw new AppError(404, `La función con ID ${id} no existe en el sistema.`);
    }

    return funcion;
  },

  async crear(datos) {
    // Regla de negocio: Evitar nombres duplicados antes de insertar
    const existe = await prisma.funcion.findUnique({
      where: { nombre: datos.nombre },
    });

    if (existe) {
      throw new AppError(409, `La función '${datos.nombre}' ya está registrada.`);
    }

    return await prisma.funcion.create({
      data: datos,
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    // Si intenta cambiar el nombre, verificamos que no colisione con otro existente
    if (datos.nombre) {
      const existe = await prisma.funcion.findUnique({
        where: { nombre: datos.nombre },
      });
      if (existe && existe.id !== parseInt(id)) {
        throw new AppError(409, `Ya existe otra función registrada con el nombre '${datos.nombre}'.`);
      }
    }

    return await prisma.funcion.update({
      where: { id: parseInt(id) },
      data: datos,
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    // Prisma levantará un error P2003 atrapado en tu error.middleware si la función está en uso
    await prisma.funcion.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },
};
