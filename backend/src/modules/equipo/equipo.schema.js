import { z } from 'zod';

export const crearEquipoSchema = z.object({
  tipoId: z.number().int('El ID del tipo de categoría debe ser un número entero'),
  nombre: z.string().min(2, 'El nombre del equipo debe tener al menos 2 caracteres').max(150),
  estado: z.enum(['DISPONIBLE', 'DANADO', 'PERDIDO', 'EN_USO']).default('DISPONIBLE'),
  valorReposicion: z.number().positive('El valor de reposición debe ser un monto positivo').nullable().optional(),
});

export const actualizarEquipoSchema = crearEquipoSchema.partial();
