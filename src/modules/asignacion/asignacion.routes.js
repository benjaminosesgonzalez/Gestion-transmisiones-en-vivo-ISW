import { Router } from 'express';
import { asignacionController } from './asignacion.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearAsignacionSchema } from './asignacion.schema.js';

const router = Router();
router.use(verificarAuth);

router.get('/', requiereRol('JEFE', 'JEFE_TECNICO'), asignacionController.listar);
router.get('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), asignacionController.obtenerPorId);

router.post('/', requiereRol('JEFE'), validar(crearAsignacionSchema), asignacionController.crear);
router.delete('/:id', requiereRol('JEFE'), asignacionController.eliminar);

export default router;
