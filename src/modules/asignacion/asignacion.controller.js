import { asignacionService } from './asignacion.service.js';

export const asignacionController = {
  async listar(req, res, next) {
    try {
      return res.status(200).json(await asignacionService.listar());
    } catch (e) { return next(e); }
  },

  async obtenerPorId(req, res, next) {
    try {
      return res.status(200).json(await asignacionService.obtenerPorId(req.params.id));
    } catch (e) { return next(e); }
  },

  async crear(req, res, next) {
    try {
      const asignacion = await asignacionService.crear(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Operador asignado al evento exitosamente.',
        data: asignacion
      });
    } catch (e) { return next(e); }
  },

  async eliminar(req, res, next) {
    try {
      await asignacionService.eliminar(req.params.id);
      return res.status(204).send();
    } catch (e) { return next(e); }
  }
};
