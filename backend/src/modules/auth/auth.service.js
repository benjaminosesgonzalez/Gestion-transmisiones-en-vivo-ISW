import { prisma } from '../../config/prisma.js';
import { comparePassword } from '../../utils/hash.js';
import { generarToken } from '../../utils/jwt.js';

export const authService = {
  async login(email, password) {
    // Buscamos al usuario anulando el 'omit' global para poder verificar su contraseña
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      omit: { password: false },
    });

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
      rol: usuario.rol,
    };

    const token = generarToken(payload);

    // Extraemos la contraseña para que jamás viaje en el objeto de retorno
    const { password: _, ...usuarioSinPassword } = usuario;

    return {
      token,
      usuario: usuarioSinPassword,
    };
  },
};
