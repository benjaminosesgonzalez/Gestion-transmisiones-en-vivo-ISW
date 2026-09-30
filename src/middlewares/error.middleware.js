import { env } from '../config/env.js';

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor inesperado.';

  // Si estamos en desarrollo, imprimimos el error completo en la consola para depurar
  if (env.NODE_ENV === 'development') {
    console.error('Error capturado en el middleware global:', err);
  }

  // Si el error es de validación de Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Error en la validación de los datos enviados.',
      errors: err.errors.map(e => ({ campo: e.path.join('.'), mensaje: e.message }))
    });
  }

  // Responder de manera estandarizada al cliente HTTP
  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
