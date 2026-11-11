import { Router } from 'express';
import { eventoController } from './evento.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearEventoSchema, actualizarEventoSchema } from './evento.schema.js';

const router = Router();
router.use(verificarAuth);

// Roles de supervisión y finanzas pueden auditar la lista de transmisiones
router.get('/', requiereRol('JEFE', 'JEFE_TECNICO', 'CONTADOR'), eventoController.listar);
router.get('/:id', requiereRol('JEFE', 'JEFE_TECNICO', 'CONTADOR'), eventoController.obtenerPorId);

// Modificaciones operativas estratégicas exclusivas de la jefatura (JEFE)
router.post('/', requiereRol('JEFE'), validar(crearEventoSchema), eventoController.crear);
router.put('/:id', requiereRol('JEFE'), validar(actualizarEventoSchema), eventoController.actualizar);
router.delete('/:id', requiereRol('JEFE'), eventoController.eliminar);

export default router;
