import { Router } from 'express';
import { gastoController } from './gasto.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearGastoSchema, actualizarGastoSchema } from './gasto.schema.js';

const router = Router();
router.use(verificarAuth);

// Auditoría de egresos: Disponible para Jefatura y Contabilidad
router.get('/', requiereRol('JEFE', 'CONTADOR'), gastoController.listar);
router.get('/:id', requiereRol('JEFE', 'CONTADOR'), gastoController.obtenerPorId);

// Gestión operativa de transacciones financieras
router.post('/', requiereRol('JEFE', 'CONTADOR'), validar(crearGastoSchema), gastoController.crear);
router.put('/:id', requiereRol('JEFE', 'CONTADOR'), validar(actualizarGastoSchema), gastoController.actualizar);
router.delete('/:id', requiereRol('JEFE', 'CONTADOR'), gastoController.eliminar);

export default router;
