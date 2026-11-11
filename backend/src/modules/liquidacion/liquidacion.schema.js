import { z } from 'zod';

export const registrarPerdidaSchema = z.object({
  eventoId: z.number().int('ID de evento inválido'),
  equipoId: z.number().int('ID de equipo inválido'),
  descripcion: z.string().min(5, 'La descripción de la pérdida o daño debe tener al menos 5 caracteres'),
  monto: z.number().positive('El valor de la pérdida debe ser un número positivo'),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD')
    .transform((val) => new Date(`${val}T00:00:00Z`)),
});

export const procesarPagoOperadorSchema = z.object({
  eventoId: z.number().int('ID de evento inválido'),
  operadorId: z.number().int('ID de operador inválido'),
  perdidaId: z.number().int().nullable().optional(),
  monto: z.number().positive('El monto a pagar debe ser positivo'),
  porcentaje: z.number().min(0).max(100).nullable().optional(), // Nullable para montos fijos
  fechaDistribucion: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD')
    .transform((val) => new Date(`${val}T00:00:00Z`)),
  estado: z.enum(['PENDIENTE', 'APROBADO', 'LIQUIDADO', 'RETENIDO']).default('PENDIENTE'),
});
