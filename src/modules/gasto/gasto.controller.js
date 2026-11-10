import { gastoService } from './gasto.service.js';

export const gastoController = {
  async listar(req, res, next) {
    try {
      const gastos = await gastoService.listar();
      return res.status(200).json(gastos);
    } catch (error) {
      return next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const gasto = await gastoService.obtenerPorId(req.params.id);
      return res.status(200).json(gasto);
    } catch (error) {
      return next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const nuevoGasto = await gastoService.crear(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Gasto registrado correctamente.',
        data: nuevoGasto
      });
    } catch (error) {
      return next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const gastoActualizado = await gastoService.actualizar(req.params.id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Gasto actualizado correctamente.',
        data: gastoActualizado
      });
    } catch (error) {
      return next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await gastoService.eliminar(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
