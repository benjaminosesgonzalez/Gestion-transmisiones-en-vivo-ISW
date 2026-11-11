import { z } from 'zod';

export const despacharEquiposSchema = z.object({
  equipos: z.array(
    z.object({
      equipoId: z.number().int('ID de equipo inválido'),
      cantidad: z.number().int().positive('La cantidad debe ser mayor a 0')
    })
  ).default([])
});

export const despacharKitsSchema = z.object({
  kits: z.array(
    z.object({
      kitId: z.number().int('ID de kit inválido'),
      cantidad: z.number().int().positive('La cantidad debe ser mayor a 0')
    })
  ).default([])
});
