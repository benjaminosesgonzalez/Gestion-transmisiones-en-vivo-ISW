import { z } from 'zod';

export const crearGastoSchema = z.object({
  eventoId: z.number().int('ID de evento inválido'),
  descripcion: z
    .string()
    .min(3, 'La descripción del gasto debe tener al menos 3 caracteres')
    .max(255, 'La descripción no puede superar los 255 caracteres'),
  monto: z.number().positive('El monto del gasto debe ser un valor positivo'),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD')
    .transform((val) => new Date(`${val}T00:00:00Z`)),
});

export const actualizarGastoSchema = crearGastoSchema.partial();
