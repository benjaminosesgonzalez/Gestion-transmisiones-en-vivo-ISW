import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

// Utilidad interna para calcular la diferencia de horas reales entre dos objetos Date
const calcularDuracionHoras = (inicio, fin) => {
  const difMiliseundos = fin.getTime() - inicio.getTime();
  return difMiliseundos / (1000 * 60 * 60);
};

export const eventoService = {
  async listar() {
    return await prisma.evento.findMany({
      include: { 
        cliente: true,
        pagos: true 
      },
      orderBy: { fecha: 'desc' },
    });
  },

  async obtenerPorId(id) {
    const evento = await prisma.evento.findUnique({
      where: { id: parseInt(id) },
      include: { 
        cliente: true,
        pagos: true,
        gastos: true,
        asignaciones: { include: { operador: true } }
      },
    });

    if (!evento) {
      throw new AppError(404, 'El evento solicitado no existe.');
    }
    return evento;
  },

  // --- CREACIÓN AVANZADA TRANSACCIONAL ---
  async crear(datos) {
    const clienteExiste = await prisma.cliente.findUnique({ where: { id: datos.clienteId } });
    if (!clienteExiste) throw new AppError(400, 'El cliente asociado no existe.');

    const horasDuracion = calcularDuracionHoras(datos.horaInicio, datos.horaFin);

    return await prisma.$transaction(async (tx) => {
      const nuevoEvento = await tx.evento.create({
        data: datos,
        include: { cliente: true }
      });

      if (horasDuracion > 5) {
        const montoAnticipo = nuevoEvento.valorTotal.mul(0.50); // 50% de Garantía/Anticipo
        const montoSaldo = nuevoEvento.valorTotal.sub(montoAnticipo); // 50% Restante

        const fechaAnticipo = new Date(nuevoEvento.fecha);
        fechaAnticipo.setDate(fechaAnticipo.getDate() - 5);

        const fechaSaldo = new Date(nuevoEvento.fecha);

        await tx.pago.createMany({
          data: [
            {
              eventoId: nuevoEvento.id,
              montoTotal: montoAnticipo,
              tipoPago: 'ANTICIPO',
              estadoPago: 'PENDIENTE',
              fechaEsperada: fechaAnticipo
            },
            {
              eventoId: nuevoEvento.id,
              montoTotal: montoSaldo,
              tipoPago: 'SALDO_TOTAL',
              estadoPago: 'PENDIENTE',
              fechaEsperada: fechaSaldo
            }
          ]
        });
      }

      return await tx.evento.findUnique({
        where: { id: nuevoEvento.id },
        include: { cliente: true, pagos: true }
      });
    });
  },

  // --- ACTUALIZACIÓN TRANSACCIONAL CON LIBERACIÓN DE OPERADORES ---
  async actualizar(id, datos) {
    const eventoActual = await this.obtenerPorId(id);

    if (datos.clienteId) {
      const clienteExiste = await prisma.cliente.findUnique({ where: { id: datos.clienteId } });
      if (!clienteExiste) throw new AppError(400, 'El cliente asociado no existe.');
    }

    return await prisma.$transaction(async (tx) => {
      // Modificamos el evento
      const eventoActualizado = await tx.evento.update({
        where: { id: parseInt(id) },
        data: datos
      });

      // REGLA DE NEGOCIO: Si pasa a CANCELADO, disuelve y libera las asignaciones horarias automáticamente
      if (datos.estado === 'CANCELADO') {
        await tx.asignacion.deleteMany({
          where: { eventoId: eventoActualizado.id }
        });
      }

      // Recalculamos duración por si el Jefe editó las horas en el frontend
      const horaInicio = datos.horaInicio || eventoActual.horaInicio;
      const horaFin = datos.horaFin || eventoActual.horaFin;
      const horasDuracion = calcularDuracionHoras(horaInicio, horaFin);

      // Si se reduce el tiempo a 5 horas o menos, limpiamos los cobros automáticos que estaban pendientes
      if (horasDuracion <= 5) {
        await tx.pago.deleteMany({
          where: { 
            eventoId: eventoActualizado.id,
            estadoPago: 'PENDIENTE'
          }
        });
      }

      return await tx.evento.findUnique({
        where: { id: eventoActualizado.id },
        include: { cliente: true, pagos: true }
      });
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
