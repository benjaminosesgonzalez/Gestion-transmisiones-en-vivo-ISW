import { z } from 'zod';

export const crearAuspiciadorSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio').max(150),
  contacto: z.string().max(150).nullable().optional(),
});

export const actualizarAuspiciadorSchema = crearAuspiciadorSchema.partial();
