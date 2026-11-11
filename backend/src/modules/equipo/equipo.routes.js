import { Router } from 'express';
import { equipoController } from './equipo.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearEquipoSchema, actualizarEquipoSchema } from './equipo.schema.js';

const router = Router();
router.use(verificarAuth);

// Lectura de inventario: Disponible para supervisores del flujo
router.get('/', requiereRol('JEFE', 'JEFE_TECNICO'), equipoController.listar);
router.get('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), equipoController.obtenerPorId);

// Escritura: Acceso concedido a JEFE y JEFE_TECNICO (encargado logístico del inventario)
router.post('/', requiereRol('JEFE', 'JEFE_TECNICO'), validar(crearEquipoSchema), equipoController.crear);
router.put('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), validar(actualizarEquipoSchema), equipoController.actualizar);
router.delete('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), equipoController.eliminar);

export default router;
