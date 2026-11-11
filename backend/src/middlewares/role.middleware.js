import { AppError } from '../utils/AppError.js';


export const requiereRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // Verificamos que el usuario esté logueado previamente mediante el auth middleware
    if (!req.user) {
      return next(new AppError(500, 'Error de configuración de seguridad del servidor. El rol fue verificado antes de la autenticación.'));
    }

    // Comprobamos si el rol asignado está dentro de los permitidos para la operación
    if (!rolesPermitidos.includes(req.user.rol)) {
      return next(new AppError(403, `Acceso denegado. Tu rol administrativo (${req.user.rol}) no tiene los permisos suficientes para esta operación.`));
    }

    return next(); // Rol verificado con éxito, permite avanzar al controlador
  };
};
