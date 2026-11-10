import { tipoEquipoService } from './tipoEquipo.service.js';

export const tipoEquipoController = {
  async listar(req, res, next) {
    try {
      return res.status(200).json(await tipoEquipoService.listar());
    } catch (error) {
      return next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      return res.status(200).json(await tipoEquipoService.obtenerPorId(req.params.id));
    } catch (error) {
      return next(error);
    }
  },

  async crear(req, res, next) {
    try {
      return res.status(201).json(await tipoEquipoService.crear(req.body));
    } catch (error) {
      return next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      return res.status(200).json(await tipoEquipoService.actualizar(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await tipoEquipoService.eliminar(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
