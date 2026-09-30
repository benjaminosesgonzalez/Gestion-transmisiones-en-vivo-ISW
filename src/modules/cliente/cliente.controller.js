import { clienteService } from './cliente.service.js';

export const clienteController = {
  async listar(req, res, next) {
    try {
      const clientes = await clienteService.listar();
      return res.status(200).json(clientes);
    } catch (error) {
      return next(error);
    }
  },

  async obtenerPorId(req, res, next) {
    try {
      const cliente = await clienteService.obtenerPorId(req.params.id);
      return res.status(200).json(cliente);
    } catch (error) {
      return next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const nuevoCliente = await clienteService.crear(req.body);
      return res.status(201).json(nuevoCliente);
    } catch (error) {
      return next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const clienteActualizado = await clienteService.actualizar(req.params.id, req.body);
      return res.status(200).json(clienteActualizado);
    } catch (error) {
      return next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await clienteService.eliminar(req.params.id);
      return res.status(204).send(); // 204 No Content: Eliminación exitosa sin cuerpo de respuesta
    } catch (error) {
      return next(error);
    }
  }
};
