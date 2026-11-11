import { z } from 'zod';

export const crearOperadorSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(120),
  rut: z.string().max(12, 'El RUT no puede superar los 12 caracteres').nullable().optional(),
  telefono: z.string().max(20, 'El teléfono no puede superar los 20 caracteres').nullable().optional(),
  email: z.string().email('Formato de correo inválido').max(100).nullable().optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
});

export const actualizarOperadorSchema = crearOperadorSchema.partial();

// Esquema para registrar una ausencia (vacaciones, licencias)
export const registrarAusenciaSchema = z.object({
  fechaInicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha de inicio debe ser YYYY-MM-DD')
    .transform((val) => new Date(`${val}T00:00:00Z`)),
  fechaFin: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha de término debe ser YYYY-MM-DD')
    .transform((val) => new Date(`${val}T00:00:00Z`)),
  motivo: z.string().max(255, 'El motivo no puede superar los 255 caracteres').nullable().optional(),
}).refine((data) => data.fechaFin >= data.fechaInicio, {
  message: 'La fecha de término no puede ser menor a la fecha de inicio',
  path: ['fechaFin'],
});

// Esquema para asignar funciones habilitadas
export const asignarFuncionesSchema = z.object({
  funcionIds: z.array(z.number().int()).min(1, 'Debes asignar al menos una función técnica'),
});
