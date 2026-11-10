import { eventoService } from './evento.service.js';

export const eventoController = {
  async listar(req, res, next) {
    try {
      const eventos = await eventoService.listar();
      return res.status(200).json(eventos);
    } catch (e) {
      return next(e);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const evento = await eventoService.obtenerPorId(req.params.id);
      return res.status(200).json(evento);
    } catch (e) {
      return next(e);
    }
  },

  async crear(req, res, next) {
    try {
      const nuevoEvento = await eventoService.crear(req.body);
      // Retornamos el código 201 Created junto al evento y sus pagos automatizados
      return res.status(201).json({
        status: 'success',
        message: 'Evento registrado exitosamente.',
        data: nuevoEvento
      });
    } catch (e) {
      return next(e);
    }
  },

  async actualizar(req, res, next) {
    try {
      const eventoActualizado = await eventoService.actualizar(req.params.id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Evento actualizado exitosamente.',
        data: eventoActualizado
      });
    } catch (e) {
      return next(e);
    }
  },

  async eliminar(req, res, next) {
    try {
      await eventoService.eliminar(req.params.id);
      return res.status(204).send();
    } catch (e) {
      return next(e);
    }
  }
};
