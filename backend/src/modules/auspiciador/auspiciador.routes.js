import { Router } from 'express';
import { auspiciadorController } from './auspiciador.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearAuspiciadorSchema, actualizarAuspiciadorSchema } from './auspiciador.schema.js';

const router = Router();
router.use(verificarAuth);

router.get('/', requiereRol('JEFE', 'CONTADOR'), auspiciadorController.listar);
router.post('/', requiereRol('JEFE'), validar(crearAuspiciadorSchema), auspiciadorController.crear);
router.put('/:id', requiereRol('JEFE'), validar(actualizarAuspiciadorSchema), auspiciadorController.actualizar);
router.delete('/:id', requiereRol('JEFE'), auspiciadorController.eliminar);

export default router;
