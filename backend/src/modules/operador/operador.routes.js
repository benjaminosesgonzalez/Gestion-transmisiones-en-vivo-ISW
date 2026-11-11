import { Router } from 'express';
import { operadorController } from './operador.controller.js';
import { verificarAuth } from '../../middlewares/auth.middleware.js';
import { requiereRol } from '../../middlewares/role.middleware.js';
import { validar } from '../../middlewares/validate.middleware.js';
import { 
  crearOperadorSchema, 
  actualizarOperadorSchema, 
  asignarFuncionesSchema, 
  registrarAusenciaSchema 
} from './operador.schema.js';

const router = Router();
router.use(verificarAuth);

router.delete('/ausencias/:ausenciaId', requiereRol('JEFE'), operadorController.eliminarAusencia);
// Operaciones estándar de Operadores (Rol JEFE)
router.get('/', requiereRol('JEFE'), operadorController.listar);
router.get('/:id', requiereRol('JEFE'), operadorController.obtenerPorId);
router.post('/', requiereRol('JEFE'), validar(crearOperadorSchema), operadorController.crear);
router.put('/:id', requiereRol('JEFE'), validar(actualizarOperadorSchema), operadorController.actualizar);

router.delete('/:id', requiereRol('JEFE'), operadorController.eliminar);

// Endpoints avanzados del módulo
router.post('/:id/funciones', requiereRol('JEFE'), validar(asignarFuncionesSchema), operadorController.asignarFunciones);
router.post('/:id/ausencias', requiereRol('JEFE'), validar(registrarAusenciaSchema), operadorController.registrarAusencia);


export default router;
