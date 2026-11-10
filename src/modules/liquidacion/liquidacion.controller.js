import { liquidacionService } from './liquidacion.service.js';

export const liquidacionController = {
  async listarLiquidaciones(req, res, next) {
    try {
      const registros = await liquidacionService.listarLiquidaciones();
      return res.status(200).json(registros);
    } catch (error) { return next(error); }
  },

  async registrarPerdida(req, res, next) {
    try {
      const nuevoIncidente = await liquidacionService.registrarPerdida(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Incidente de inventario registrado y estado de equipo actualizado.',
        data: nuevoIncidente
      });
    } catch (error) { return next(error); }
  },

  async liquidarOperador(req, res, next) {
    try {
      const liquidacion = await liquidacionService.liquidarOperador(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Liquidación de pago procesada y registrada en el sistema de egresos.',
        data: liquidacion
      });
    } catch (error) { return next(error); }
  }
};
