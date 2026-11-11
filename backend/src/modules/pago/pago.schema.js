import { z } from 'zod';

export const registrarAbonoSchema = z.object({
  eventoId: z.coerce.number().int('ID de evento inválido'),
  monto: z.coerce.number().positive('El monto a abonar debe ser mayor a 0'),
  fechaPago: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .transform((val) => new Date(`${val}T00:00:00Z`)),
  metodoPago: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(['TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'OTRO'])),
  notas: z.string().max(500).nullable().optional(),
});
