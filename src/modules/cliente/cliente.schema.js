import { z } from 'zod';

export const crearClienteSchema = z.object({
  nombre: z.string().min(3).max(150, 'El nombre no puede superar los 150 caracteres'),
  telefono: z.string().max(20, 'El teléfono no puede superar los 20 caracteres').nullable().optional(),
  rut: z.string().max(12, 'El RUT no puede superar los 12 caracteres').nullable().optional(),
  razonSocial: z.string().max(150, 'La razón social no puede superar los 150 caracteres').nullable().optional(),
  direccion: z.string().max(255, 'La dirección no puede superar los 255 caracteres').nullable().optional(),
});

export const actualizarClienteSchema = crearClienteSchema.partial();
