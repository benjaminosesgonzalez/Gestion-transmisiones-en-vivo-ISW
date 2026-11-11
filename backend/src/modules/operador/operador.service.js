import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const operadorService = {
  async listar() {
    return await prisma.operador.findMany({
      include: {
        funciones: {
          include: { funcion: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });
  },

  async obtenerPorId(id) {
    const operador = await prisma.operador.findUnique({
      where: { id: parseInt(id) },
      include: {
        funciones: { include: { funcion: true } },
        ausencias: true
      }
    });

    if (!operador) {
      throw new AppError(404, 'Operador no encontrado en el sistema.');
    }
    return operador;
  },

  async crear(datos) {
    if (datos.rut) {
      const existeRut = await prisma.operador.findUnique({ where: { rut: datos.rut } });
      if (existeRut) throw new AppError(409, 'Ya existe un operador registrado con ese RUT.');
    }
    if (datos.email) {
      const existeEmail = await prisma.operador.findUnique({ where: { email: datos.email } });
      if (existeEmail) throw new AppError(409, 'Ya existe un operador registrado con ese correo.');
    }

    return await prisma.operador.create({ data: datos });
  },

  async actualizar(id, datos) {
    await this.obtenerPorId(id);

    if (datos.rut) {
      const existeRut = await prisma.operador.findUnique({ where: { rut: datos.rut } });
      if (existeRut && existeRut.id !== parseInt(id)) throw new AppError(409, 'El RUT ya pertenece a otro operador.');
    }
    if (datos.email) {
      const existeEmail = await prisma.operador.findUnique({ where: { email: datos.email } });
      if (existeEmail && existeEmail.id !== parseInt(id)) throw new AppError(409, 'El correo ya pertenece a otro operador.');
    }

    return await prisma.operador.update({
      where: { id: parseInt(id) },
      data: datos
    });
  },

  async eliminar(id) {
    await this.obtenerPorId(id);
    await prisma.operador.delete({ where: { id: parseInt(id) } });
    return true;
  },

  // --- LÓGICA AVANZADA: ASIGNAR FUNCIONES HABILITADAS ---
  async asignarFunciones(operadorId, funcionIds) {
    await this.obtenerPorId(operadorId);

    // Verificamos que todas las funciones enviadas existan en el catálogo maestro
    const funcionesExistentes = await prisma.funcion.findMany({
      where: { id: { in: funcionIds } }
    });
    if (funcionesExistentes.length !== funcionIds.length) {
      throw new AppError(400, 'Una o más funciones enviadas no son válidas.');
    }

    // Usamos una transacción para limpiar antiguas y guardar las nuevas de golpe
    return await prisma.$transaction(async (tx) => {
      await tx.operadorFuncion.deleteMany({ where: { operadorId: parseInt(operadorId) } });

      await tx.operadorFuncion.createMany({
        data: funcionIds.map(fId => ({
          operadorId: parseInt(operadorId),
          funcionId: fId
        }))
      });

      return tx.operador.findUnique({
        where: { id: parseInt(operadorId) },
        include: { funciones: { include: { funcion: true } } }
      });
    });
  },

  // --- LÓGICA AVANZADA: GESTIÓN DE AUSENCIAS ---
  async registrarAusencia(operadorId, datos) {
    await this.obtenerPorId(operadorId);

    return await prisma.ausencia.create({
      data: {
        operadorId: parseInt(operadorId),
        fechaInicio: datos.fechaInicio,
        fechaFin: datos.fechaFin,
        motivo: datos.motivo
      }
    });
  }
};
