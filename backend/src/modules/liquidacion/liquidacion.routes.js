import { Router } from 'express';
import { liquidacionController } from './liquidacion.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { registrarPerdidaSchema, procesarPagoOperadorSchema } from './liquidacion.schema.js';

const router = Router();
router.use(verificarAuth);

// Ver el historial de egresos y liquidaciones
router.get('/', requiereRol('JEFE', 'CONTADOR'), liquidacionController.listarLiquidaciones);
router.get('/incidentes', requiereRol('JEFE', 'CONTADOR'), liquidacionController.listarIncidentes);

// Rutas operativas de finanzas y control de daños
router.post('/incidente', requiereRol('JEFE', 'CONTADOR'), validar(registrarPerdidaSchema), liquidacionController.registrarPerdida);
router.post('/operador', requiereRol('JEFE', 'CONTADOR'), validar(procesarPagoOperadorSchema), liquidacionController.liquidarOperador);

export default router;
