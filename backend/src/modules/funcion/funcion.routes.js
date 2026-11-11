import { Router } from 'express';
import { funcionController } from './funcion.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearFuncionSchema, actualizarFuncionSchema } from './funcion.schema.js';

const router = Router();

// Todas las rutas requieren inicio de sesión previo
router.use(verificarAuth);

// Lectura permitida para JEFE y JEFE_TECNICO
router.get('/', requiereRol('JEFE', 'JEFE_TECNICO'), funcionController.listar);
router.get('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), funcionController.obtenerPorId);

// Modificaciones exclusivas del administrador (JEFE)
router.post('/', requiereRol('JEFE'), validar(crearFuncionSchema), funcionController.crear);
router.put('/:id', requiereRol('JEFE'), validar(actualizarFuncionSchema), funcionController.actualizar);
router.delete('/:id', requiereRol('JEFE'), funcionController.eliminar);

export default router;
