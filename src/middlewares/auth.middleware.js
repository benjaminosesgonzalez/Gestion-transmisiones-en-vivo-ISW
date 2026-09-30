import { verificarToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export const verificarAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Validamos que el header comience con la convención estándar "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No autorizado. Token de acceso ausente o malformado.');
    }

    const token = authHeader.split(' ')[1];
    
    // Verificamos y decodificamos el token JWT
    const decoded = verificarToken(token);

    // Inyectamos el id y el rol en el objeto 'req' para que estén disponibles en el controller
    req.user = {
      id: decoded.id,
      rol: decoded.rol
    };

    return next(); // Damos el pase al siguiente eslabón (Rol middleware o controlador)
  } catch (error) {
    // Si el token expiró o es inválido, lanzamos un 401 que capturará el errorMiddleware
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'El token de sesión ha expirado. Por favor, inicia sesión nuevamente.'));
    }
    return next(new AppError(401, 'Token de acceso inválido o alterado.'));
  }
};
