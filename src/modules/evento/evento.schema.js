import { z } from 'zod';

export const crearEventoSchema = z.object({
  cliente_id: z.number().int('ID de cliente inválido'),
  tipo_id: z.number().int('ID de tipo de evento inválido'),
  nombre: z.string().min(5).max(150),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD'),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora de inicio inválido (HH:MM)'),
  hora_fin: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora de fin inválido (HH:MM)'),
  zona: z.string().max(100),
  valor_total: z.number().positive('El valor total debe ser un número positivo'),
  porcentaje_utilidad: z.number().min(0).max(100),
  es_rentable: z.boolean().nullable().optional(), // Nullable tal como lo definimos
  estado: z.enum(['PROGRAMADO', 'FINALIZADO', 'CANCELADO']).default('PROGRAMADO'),
  notas: z.string().nullable().optional(),
});

export const actualizarEventoSchema = crearEventoSchema.partial();
