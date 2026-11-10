import { Router } from 'express';
import { kitController } from './kit.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearKitSchema, actualizarKitSchema, configurarKitSchema } from './kit.schema.js';

const router = Router();
router.use(verificarAuth);

// Lectura de kits
router.get('/', requiereRol('JEFE', 'JEFE_TECNICO'), kitController.listar);
router.get('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), kitController.obtenerPorId);

// Escritura y desmantelamiento de Kits maestros
router.post('/', requiereRol('JEFE', 'JEFE_TECNICO'), validar(crearKitSchema), kitController.crear);
router.put('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), validar(actualizarKitSchema), kitController.actualizar);
router.delete('/:id', requiereRol('JEFE', 'JEFE_TECNICO'), kitController.eliminar);

// Endpoint avanzado mapeado con la nueva estructura limpia
router.post('/:id/equipos', requiereRol('JEFE', 'JEFE_TECNICO'), validar(configurarKitSchema), kitController.configurarKit);

export default router;
