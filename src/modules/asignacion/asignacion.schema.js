import { z } from 'zod';

const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;

export const crearAsignacionSchema = z.object({
  eventoId: z.number().int('ID de evento inválido'),
  operadorId: z.number().int('ID de operador inválido'),
  horaInicio: z
    .string()
    .regex(timeRegex, 'Formato de hora de inicio inválido (HH:MM)')
    .transform((val) => new Date(`1970-01-01T${val.length === 5 ? `${val}:00` : val}Z`)),
  horaFin: z
    .string()
    .regex(timeRegex, 'Formato de hora de fin inválido (HH:MM)')
    .transform((val) => new Date(`1970-01-01T${val.length === 5 ? `${val}:00` : val}Z`)),
  observacion: z.string().max(255).nullable().optional(),
  funcionIds: z.array(z.number().int()).min(1, 'Debes asignar al menos una función para este operador en el evento'),
});

export const actualizarAsignacionSchema = crearAsignacionSchema.partial();
