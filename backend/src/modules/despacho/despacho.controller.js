import { despachoService } from './despacho.service.js';

export const despachoController = {
  async asociarEquipos(req, res, next) {
    try {
      const resultado = await despachoService.asociarEquipos(req.params.eventoId, req.body.equipos);
      return res.status(200).json({
        status: 'success',
        message: 'Equipos sueltos despachados y reservados exitosamente.',
        data: resultado
      });
    } catch (error) { return next(error); }
  },

  async asociarKits(req, res, next) {
    try {
      const resultado = await despachoService.asociarKits(req.params.eventoId, req.body.kits);
      return res.status(200).json({
        status: 'success',
        message: 'Kits logísticos despachados y reservados exitosamente.',
        data: resultado
      });
    } catch (error) { return next(error); }
  }
};
