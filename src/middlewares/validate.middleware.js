export const validar = (schema) => {
  return async (req, res, next) => {
    try {
      // Parseamos y validamos de forma asíncrona
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      // El error de Zod será capturado automáticamente por el errorMiddleware global
      return next(error);
    }
  };
};
