import { equipoService } from './equipo.service.js';

export const equipoController = {
  async listar(req, res, next) {
    try {
      return res.status(200).json(await equipoService.listar());
    } catch (error) {
      return next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      return res.status(200).json(await equipoService.obtenerPorId(req.params.id));
    } catch (error) {
      return next(error);
    }
  },

  async crear(req, res, next) {
    try {
      return res.status(201).json(await equipoService.crear(req.body));
    } catch (error) {
      return next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      return res.status(200).json(await equipoService.actualizar(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await equipoService.eliminar(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
