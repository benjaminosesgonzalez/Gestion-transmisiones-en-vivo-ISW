import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const auspiciadorService = {
  async listar() {
    return await prisma.empresaAuspiciadora.findMany({ orderBy: { nombre: 'asc' } });
  },
  async crear(datos) {
    return await prisma.empresaAuspiciadora.create({ data: datos });
  },
  async actualizar(id, datos) {
    return await prisma.empresaAuspiciadora.update({
      where: { id: parseInt(id) },
      data: datos,
    });
  },
  async eliminar(id) {
    await prisma.empresaAuspiciadora.delete({ where: { id: parseInt(id) } });
    return true;
  },
};
