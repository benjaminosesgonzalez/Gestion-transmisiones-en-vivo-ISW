import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const kitService = {
  async listar() {
    return await prisma.kit.findMany({
      include: {
        kitEquipos: {
          include: { equipo: { include: { tipoEquipo: true } } },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  },

  async obtenerPorId(id) {
    const kit = await prisma.kit.findUnique({
      where: { id: parseInt(id) },
      include: {
        kitEquipos: {
          include: { equipo: { include: { tipoEquipo: true } } },
        },
      },
    });

    if (!kit) {
      throw new AppError(404, `El Kit logístico con ID ${id} no existe.`);
    }
    return kit;
  },

  async crear(datos) {
    const existe = await prisma.kit.findUnique({
      where: { nombre: datos.nombre },
    });

    if (existe) {
      throw new AppError(409, `Ya existe un kit registrado con el nombre '${datos.nombre}'.`);
    }

    return await prisma.kit.create({
      data: datos,
    });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    if (datos.nombre) {
      const existe = await prisma.kit.findUnique({
        where: { nombre: datos.nombre },
      });
      if (existe && existe.id !== parseInt(id)) {
        throw new AppError(409, `El nombre de kit '${datos.nombre}' ya está siendo usado por otro registro.`);
      }
    }

    return await prisma.kit.update({
      where: { id: parseInt(id) },
      data: datos,
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);

    await prisma.kit.delete({
      where: { id: parseInt(id) },
    });

    return true;
  },

  // Función renombrada con tu directriz semántica
  async configurarKit(kitId, listaEquipos) {
    await this.obtenerPorId(kitId);

    const equipoIds = listaEquipos.map((e) => e.equipoId);

    // Regla de Negocio: Cada ID de Equipo representa 1 pieza física única en inventario
    const excedeStockFisico = listaEquipos.some((e) => e.cantidad > 1);
    if (excedeStockFisico) {
      throw new AppError(400, 'Cada equipo del inventario representa 1 unidad física única, la cantidad máxima por ítem en un kit es 1.');
    }

    const equiposExistentes = await prisma.equipo.findMany({
      where: { id: { in: equipoIds } },
    });

    if (equiposExistentes.length !== equipoIds.length) {
      throw new AppError(400, 'Uno o más IDs de equipos proporcionados no existen en el inventario maestro.');
    }

    return await prisma.$transaction(async (tx) => {
      await tx.kitEquipo.deleteMany({
        where: { kitId: parseInt(kitId) },
      });

      await tx.kitEquipo.createMany({
        data: listaEquipos.map((e) => ({
          kitId: parseInt(kitId),
          equipoId: e.equipoId,
          cantidad: e.cantidad,
        })),
      });

      return tx.kit.findUnique({
        where: { id: parseInt(kitId) },
        include: {
          kitEquipos: { include: { equipo: true } },
        },
      });
    });
  },
};
