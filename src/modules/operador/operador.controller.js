import { operadorService } from './operador.service.js';

export const operadorController = {
  async listar(req, res, next) {
    try { return res.json(await operadorService.listar()); } catch (e) { return next(e); }
  },
  async obtenerPorId(req, res, next) {
    try { return res.json(await operadorService.obtenerPorId(req.params.id)); } catch (e) { return next(e); }
  },
  async crear(req, res, next) {
    try { return res.status(201).json(await operadorService.crear(req.body)); } catch (e) { return next(e); }
  },
  async actualizar(req, res, next) {
    try { return res.json(await operadorService.actualizar(req.params.id, req.body)); } catch (e) { return next(e); }
  },
  async eliminar(req, res, next) {
    try { await operadorService.eliminar(req.params.id); return res.status(204).send(); } catch (e) { return next(e); }
  }
};
