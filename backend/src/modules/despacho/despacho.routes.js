import { Router } from 'express';
import { despachoController } from './despacho.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { despacharEquiposSchema, despacharKitsSchema } from './despacho.schema.js';

const router = Router();
router.use(verificarAuth);

// Endpoints anidados lógicamente por ID de Evento para sincronización limpia con el Frontend
router.post('/evento/:eventoId/equipos', requiereRol('JEFE', 'JEFE_TECNICO'), validar(despacharEquiposSchema), despachoController.asociarEquipos);
router.post('/evento/:eventoId/kits', requiereRol('JEFE', 'JEFE_TECNICO'), validar(despacharKitsSchema), despachoController.asociarKits);

export default router;
