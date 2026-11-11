import { z } from 'zod';

export const crearTipoEquipoSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre de la categoría debe tener al menos 2 caracteres')
    .max(100, 'El nombre de la categoría no puede superar los 100 caracteres')
    .toUpperCase(), // Mantenemos consistencia en mayúsculas con lo ingresado en el Seed
});

export const actualizarTipoEquipoSchema = crearTipoEquipoSchema.partial();
