import { funcionService } from './funcion.service.js';

export const funcionController = {
  async listar(req, res, next) {
    try {
      const funciones = await funcionService.listar();
      return res.status(200).json(funciones);
    } catch (error) {
      return next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const funcion = await funcionService.obtenerPorId(req.params.id);
      return res.status(200).json(funcion);
    } catch (error) {
      return next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const nuevaFuncion = await funcionService.crear(req.body);
      return res.status(201).json(nuevaFuncion);
    } catch (error) {
      return next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const funcionActualizada = await funcionService.actualizar(req.params.id, req.body);
      return res.status(200).json(funcionActualizada);
    } catch (error) {
      return next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await funcionService.eliminar(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
