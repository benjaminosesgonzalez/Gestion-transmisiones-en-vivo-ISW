import { Prisma } from '@prisma/client';
import { env } from '../config/env.js';

export const errorMiddleware = (err, req, res, next) => {
  // Si estamos en desarrollo, imprimimos el error completo en la consola para depurar
  if (env.NODE_ENV === 'development') {
    console.error('Error capturado en el middleware global:', err);
  }

  // 1. Errores de validación de Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Error en la validación de los datos enviados.',
      errors: err.errors.map((e) => ({
        campo: e.path.join('.'),
        mensaje: e.message,
      })),
    });
  }

  // 2. Errores conocidos de Prisma ORM
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Violación de restricción única (ej: email o RUT duplicado)
    if (err.code === 'P2002') {
      const campos = err.meta?.target ? err.meta.target.join(', ') : 'campo único';
      return res.status(409).json({
        status: 'error',
        statusCode: 409,
        message: `Ya existe un registro con ese valor (${campos}).`,
      });
    }

    // P2003: Violación de llave foránea (ej: asignar un clienteId que no existe, o borrar un registro en uso)
    if (err.code === 'P2003') {
      return res.status(409).json({
        status: 'error',
        statusCode: 409,
        message: 'No se puede completar la operación porque el registro está relacionado o referenciado por otros datos.',
      });
    }

    // P2025: Registro no encontrado para actualizar o eliminar
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'El registro solicitado no existe o ya fue eliminado.',
      });
    }
  }

  // 3. Errores personalizados (AppError) o errores genéricos inesperados
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor inesperado.';

  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
