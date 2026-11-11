import { pagoService } from './pago.service.js';

export const pagoController = {
  async listar(req, res, next) {
    try {
      const resumen = await pagoService.listarPagosEventos();
      return res.status(200).json(resumen);
    } catch (error) {
      return next(error);
    }
  },

  async registrarAbono(req, res, next) {
    try {
      const comprobanteUrl = req.file ? `/uploads/comprobantes/${req.file.filename}` : null;
      const abono = await pagoService.registrarAbono(req.body, comprobanteUrl);
      return res.status(201).json({
        status: 'success',
        message: 'Abono procesado y registrado exitosamente.',
        data: abono,
      });
    } catch (error) {
      return next(error);
    }
  },
};
