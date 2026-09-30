import { eventoService } from './evento.service.js';

export const eventoController = {
  async listar(req, res, next) {
    try { return res.json(await eventoService.listar()); } catch (e) { return next(e); }
  },
  async obtenerPorId(req, res, next) {
    try { return res.json(await eventoService.obtenerPorId(req.params.id)); } catch (e) { return next(e); }
  },
  async crear(req, res, next) {
    try { return res.status(201).json(await eventoService.crear(req.body)); } catch (e) { return next(e); }
  },
  async actualizar(req, res, next) {
    try { return res.json(await eventoService.actualizar(req.params.id, req.body)); } catch (e) { return next(e); }
  },
  async eliminar(req, res, next) {
    try { await eventoService.eliminar(req.params.id); return res.status(204).send(); } catch (e) { return next(e); }
  }
};
