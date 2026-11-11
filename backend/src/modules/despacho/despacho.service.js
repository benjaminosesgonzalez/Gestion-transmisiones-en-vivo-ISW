import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const despachoService = {
  // Algoritmo interno para comprobar la disponibilidad física real de un equipo en un horario específico
  async verificarDisponibilidadEquipo(eventoId, equipoId, cantidadRequerida, tx) {
    const db = tx || prisma;

    // 1. Obtener los datos del evento actual para conocer el marco temporal
    const eventoActual = await db.evento.findUnique({ where: { id: eventoId } });
    if (!eventoActual) throw new AppError(404, 'El evento especificado no existe.');

    // 2. Verificar que el equipo esté en estado DISPONIBLE en el catálogo maestro
    const equipoMaestro = await db.equipo.findUnique({ where: { id: equipoId } });
    if (!equipoMaestro || equipoMaestro.estado !== 'DISPONIBLE') {
      throw new AppError(409, `El equipo con ID ${equipoId} no está apto para operaciones (dañado o perdido).`);
    }

    // 3. Buscar todos los eventos que se crucen en fecha y horario (ignora cancelados y el mismo evento)
    const eventosConflictivos = await db.evento.findMany({
      where: {
        fecha: eventoActual.fecha,
        estado: { notIn: ['CANCELADO', 'BORRADOR'] },
        id: { not: eventoId },
        AND: [
          { horaInicio: { lt: eventoActual.horaFin } },
          { horaFin: { gt: eventoActual.horaInicio } }
        ]
      },
      select: { id: true }
    });

    const conflictoIds = eventosConflictivos.map(e => e.id);

    // Si hay eventos concurrentes, calculamos el consumo acumulado de este equipo en esa franja horaria
    let unidadesEnUso = 0;
    if (conflictoIds.length > 0) {
      // A. Sumar unidades asignadas de forma suelta en EventoEquipo
      const usoSuelto = await db.eventoEquipo.aggregate({
        where: {
          eventoId: { in: conflictoIds },
          equipoId: equipoId
        },
        _sum: { cantidad: true }
      });
      unidadesEnUso += usoSuelto._sum.cantidad || 0;

      // B. Sumar unidades asignadas de forma implícita dentro de recetas de kits en EventoKit
      const usoEnKits = await db.eventoKit.findMany({
        where: { eventoId: { in: conflictoIds } },
        include: { kit: { include: { kitEquipos: true } } }
      });

      for (const evKit of usoEnKits) {
        const coincidenciaReceta = evKit.kit.kitEquipos.find(ke => ke.equipoId === equipoId);
        if (coincidenciaReceta) {
          unidadesEnUso += coincidenciaReceta.cantidad * evKit.cantidad;
        }
      }
    }

    // Regla de Negocio: En este flujo simplificado por equipo individual (ID único), el stock total es 1 por registro físico.
    // Si ya se está usando en otro lado concurrentemente, la disponibilidad es 0.
    const stockDisponible = 1 - unidadesEnUso;

    if (cantidadRequerida > stockDisponible) {
      throw new AppError(409, `Conflicto de Solapamiento Horario: El equipo '${equipoMaestro.nombre}' (ID: ${equipoId}) ya está comprometido en otra transmisión o kit para esa misma franja horaria.`);
    }
    return true;
  },

  // --- DESPACHAR EQUIPOS SUELTOS ---
  async asociarEquipos(eventoId, listaEquipos) {
    const idEv = parseInt(eventoId);
    
    return await prisma.$transaction(async (tx) => {
      // Limpiamos despacho suelto anterior del evento para reconfigurar
      await tx.eventoEquipo.deleteMany({ where: { eventoId: idEv } });

      // Validamos la disponibilidad horaria de cada item solicitado
      for (const item of listaEquipos) {
        await this.verificarDisponibilidadEquipo(idEv, item.equipoId, item.cantidad, tx);
      }

      // Si todos están libres, se consolida el despacho
      await tx.eventoEquipo.createMany({
        data: listaEquipos.map(item => ({
          eventoId: idEv,
          equipoId: item.equipoId,
          cantidad: item.cantidad
        }))
      });

      return tx.evento.findUnique({
        where: { id: idEv },
        include: { eventoEquipos: { include: { equipo: true } } }
      });
    });
  },

  // --- DESPACHAR KITS COMPLETOS ---
  async asociarKits(eventoId, listaKits) {
    const idEv = parseInt(eventoId);

    return await prisma.$transaction(async (tx) => {
      await tx.eventoKit.deleteMany({ where: { eventoId: idEv } });

      // Para validar un kit, primero extraemos su receta interna de componentes de la base de datos
      for (const itemKit of listaKits) {
        const recetaKit = await tx.kitEquipo.findMany({
          where: { kitId: itemKit.kitId }
        });

        // Verificamos la disponibilidad horaria de cada componente de la receta multiplicada por los kits pedidos
        for (const componente of recetaKit) {
          const cantidadTotalEquipo = componente.cantidad * itemKit.cantidad;
          await this.verificarDisponibilidadEquipo(idEv, componente.equipoId, cantidadTotalEquipo, tx);
        }
      }

      // Si ninguna receta colisiona, se consolida el despacho de los kits
      await tx.eventoKit.createMany({
        data: listaKits.map(item => ({
          eventoId: idEv,
          kitId: item.kitId,
          cantidad: item.cantidad
        }))
      });

      return tx.evento.findUnique({
        where: { id: idEv },
        include: { eventoKits: { include: { kit: true } } }
      });
    });
  }
};
