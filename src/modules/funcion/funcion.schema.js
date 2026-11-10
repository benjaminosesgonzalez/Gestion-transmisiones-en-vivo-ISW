import { z } from 'zod';

export const crearFuncionSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre de la función debe tener al menos 3 caracteres')
    .max(100, 'El nombre de la función no puede superar los 100 caracteres')
    .toUpperCase(), // Forzamos mayúsculas para mantener consistencia con el Seed (ej: CAMARA)
  descripcion: z
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .nullable()
    .optional(),
});

export const actualizarFuncionSchema = crearFuncionSchema.partial();
