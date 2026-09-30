import { AppDataSource } from '../../config/data-source.js';
import { AppError } from '../../utils/AppError.js';

const repo = AppDataSource.getRepository('Operador');

export const operadorService = { 
  async listar() {
    return await repo.find();
  },
  async obtenerPorId(id) {
    const operador = await repo.findOneBy({ id: parseInt(id) });
    if (!operador) throw new AppError(404, 'Operador no encontrado.');
    return operador;
  },
  async crear(datos) {
    return await repo.save(repo.create(datos));
  },
  async actualizar(id, datos) {
    const operador = await this.obtenerPorId(id);
    repo.merge(operador, datos);
    return await repo.save(operador);
  },
  async eliminar(id) {
    const operador = await this.obtenerPorId(id);
    await repo.remove(operador);
    return true;
  }
};
