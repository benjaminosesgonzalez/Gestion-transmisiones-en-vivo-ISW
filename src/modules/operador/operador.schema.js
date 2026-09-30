import { z } from 'zod';

export const crearOperadorSchema = z.object({
  nombre: z.string().min(3).max(120),
  rut: z.string().max(12).nullable().optional(),
  telefono: z.string().max(20).nullable().optional(),
  email: z.string().email().max(100).nullable().optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
});

export const actualizarOperadorSchema = crearOperadorSchema.partial();
