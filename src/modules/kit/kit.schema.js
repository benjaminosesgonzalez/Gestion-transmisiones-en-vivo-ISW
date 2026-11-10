import { z } from 'zod';

export const crearKitSchema = z.object({
  nombre: z.string().min(3, 'El nombre del kit debe tener al menos 3 caracteres').max(150),
  descripcion: z.string().max(500, 'La descripción no puede superar los 500 caracteres').nullable().optional(),
});

export const actualizarKitSchema = crearKitSchema.partial();

// Refactorizado de forma limpia y directa
export const configurarKitSchema = z.object({
  equipos: z.array(
    z.object({
      equipoId: z.number().int('ID de equipo inválido'),
      cantidad: z.number().int().positive('La cantidad debe ser mayor a 0'),
    })
  ).min(1, 'Debes agregar al menos un equipo físico para componer el kit'),
});
