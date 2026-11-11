import { auspiciadorService } from './auspiciador.service.js';

export const auspiciadorController = {
  async listar(req, res, next) {
    try { return res.status(200).json(await auspiciadorService.listar()); } catch (e) { return next(e); }
  },
  async crear(req, res, next) {
    try { return res.status(201).json(await auspiciadorService.crear(req.body)); } catch (e) { return next(e); }
  },
  async actualizar(req, res, next) {
    try { return res.status(200).json(await auspiciadorService.actualizar(req.params.id, req.body)); } catch (e) { return next(e); }
  },
  async eliminar(req, res, next) {
    try { await auspiciadorService.eliminar(req.params.id); return res.status(204).send(); } catch (e) { return next(e); }
  },
};
