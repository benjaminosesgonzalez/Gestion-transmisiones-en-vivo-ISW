import { operadorService } from './operador.service.js';

export const operadorController = {
  async listar(req, res, next) {
    try { return res.status(200).json(await operadorService.listar()); } catch (e) { return next(e); }
  },
  async obtenerPorId(req, res, next) {
    try { return res.status(200).json(await operadorService.obtenerPorId(req.params.id)); } catch (e) { return next(e); }
  },
  async crear(req, res, next) {
    try { return res.status(201).json(await operadorService.crear(req.body)); } catch (e) { return next(e); }
  },
  async actualizar(req, res, next) {
    try { return res.status(200).json(await operadorService.actualizar(req.params.id, req.body)); } catch (e) { return next(e); }
  },
  async eliminar(req, res, next) {
    try { await operadorService.eliminar(req.params.id); return res.status(204).send(); } catch (e) { return next(e); }
  },
  
  async eliminarAusencia(req, res, next) {
    try {
      await operadorService.eliminarAusencia(req.params.ausenciaId);
      return res.status(204).send();
    } catch (e) {
      return next(e);
    }
  },

  // Controles avanzados
  async asignarFunciones(req, res, next) {
    try {
      const resultado = await operadorService.asignarFunciones(req.params.id, req.body.funcionIds);
      return res.status(200).json(resultado);
    } catch (e) { return next(e); }
  },
  async registrarAusencia(req, res, next) {
    try {
      const nuevaAusencia = await operadorService.registrarAusencia(req.params.id, req.body);
      return res.status(201).json(nuevaAusencia);
    } catch (e) { return next(e); }
  }
};
