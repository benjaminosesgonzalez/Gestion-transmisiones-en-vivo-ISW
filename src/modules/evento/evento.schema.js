import { z } from 'zod';

const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;

const parseTimeToDate = (timeStr) => {
  const normalized = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  return new Date(`1970-01-01T${normalized}Z`);
};

export const crearEventoSchema = z.object({
  clienteId: z.number().int('ID de cliente inválido'),
  nombre: z.string().min(5).max(150),
  tipo: z.string().max(80).nullable().optional(),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD')
    .transform((val) => new Date(`${val}T00:00:00Z`)),
  horaInicio: z
    .string()
    .regex(timeRegex, 'Formato de hora de inicio inválido (HH:MM)')
    .transform(parseTimeToDate),
  horaFin: z
    .string()
    .regex(timeRegex, 'Formato de hora de fin inválido (HH:MM)')
    .transform(parseTimeToDate),
  zona: z.string().max(100),
  valorTotal: z.number().positive('El valor total debe ser un número positivo'),
  porcentajeUtilidad: z.number().min(0).max(100),
  esRentable: z.boolean().nullable().optional(),
  estado: z
    .enum(['BORRADOR', 'PROGRAMADO', 'FINALIZADO', 'CANCELADO'])
    .default('PROGRAMADO'),
  notas: z.string().nullable().optional(),
});

export const actualizarEventoSchema = crearEventoSchema.partial();
