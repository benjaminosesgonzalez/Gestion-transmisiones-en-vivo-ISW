import { authService } from './auth.service.js';

export const authController = { 
  /**
   * Endpoint POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
      }

      const resultado = await authService.login(email, password);

      if (!resultado) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      // Retornamos el token de acceso junto a los datos del usuario
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error interno en el servidor durante el login.', 
        error: error.message 
      });
    }
  }
};
