import { Router } from 'express';
import { tipoEquipoController } from './tipoEquipo.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearTipoEquipoSchema, actualizarTipoEquipoSchema } from './tipoEquipo.schema.js';

const router = Router();

router.use(verificarAuth);

// Lectura de categorías permitida para JEFE y JEFE_TECNICO
router.get('/', requiereRol('JEFE', 'JEFE_TECNICO'), tipoEquipoController.listar);
router.get('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), tipoEquipoController.obtenerPorId);

// Modificaciones exclusivas para el JEFE y el JEFE_TECNICO (encargado del inventario)
router.post('/', requiereRol('JEFE', 'JEFE_TECNICO'), validar(crearTipoEquipoSchema), tipoEquipoController.crear);
router.put('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), validar(actualizarTipoEquipoSchema), tipoEquipoController.actualizar);
router.delete('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), tipoEquipoController.eliminar);

export default router;
