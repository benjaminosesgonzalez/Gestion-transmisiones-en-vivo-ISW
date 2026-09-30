import { AppDataSource } from '../../config/data-source.js';
import { comparePassword } from '../../utils/hash.js';
import { generarToken } from '../../utils/jwt.js';

const usuarioRepository = AppDataSource.getRepository('Usuario');

export const authService = {

  async login(email, password) {
    // Buscamos al usuario incluyendo explícitamente el password
    const usuario = await usuarioRepository.createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email })
      .getOne();

    if (!usuario) {
      return null;
    }

    // Comparamos contraseñas usando nuestra utilidad centralizada
    const passwordValido = await comparePassword(password, usuario.password);
    if (!passwordValido) {
      return null;
    }

    // Preparamos los datos del token
    const payload = {
      id: usuario.id,
      rol: usuario.rol
    };

    const token = generarToken(payload);

    // Removemos la contraseña del objeto de respuesta por seguridad
    delete usuario.password;

    return {
      token,
      usuario
    };
  }
};
