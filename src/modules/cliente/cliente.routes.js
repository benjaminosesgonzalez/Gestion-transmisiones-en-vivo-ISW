import { Router } from 'express';
import { clienteController } from './cliente.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { crearClienteSchema, actualizarClienteSchema } from './cliente.schema.js';

const router = Router();

// Todas las operaciones de clientes exigen estar autenticado
router.use(verificarAuth);

// Rutas de lectura: Disponibles para JEFE y CONTADOR
router.get('/', requiereRol('JEFE', 'CONTADOR'), clienteController.listar);
router.get('/:id', requiereRol('JEFE', 'CONTADOR'), clienteController.obtenerPorId);

// Rutas de escritura y modificación: Exclusivas del rol JEFE
router.post('/', requiereRol('JEFE'), validar(crearClienteSchema), clienteController.crear);
router.put('/:id', requiereRol('JEFE'), validar(actualizarClienteSchema), clienteController.actualizar);
router.delete('/:id', requiereRol('JEFE'), clienteController.eliminar);

export default router;
