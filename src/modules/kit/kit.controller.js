import { kitService } from './kit.service.js';

export const kitController = {
  async listar(req, res, next) {
    try {
      return res.status(200).json(await kitService.listar());
    } catch (error) {
      return next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      return res.status(200).json(await kitService.obtenerPorId(req.params.id));
    } catch (error) {
      return next(error);
    }
  },

  async crear(req, res, next) {
    try {
      return res.status(201).json(await kitService.crear(req.body));
    } catch (error) {
      return next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      return res.status(200).json(await kitService.actualizar(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await kitService.eliminar(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  // Controlador con el nuevo nombre de la función de negocio
  async configurarKit(req, res, next) {
    try {
      const kitConfigurado = await kitService.configurarKit(req.params.id, req.body.equipos);
      return res.status(200).json(kitConfigurado);
    } catch (error) {
      return next(error);
    }
  },
};
