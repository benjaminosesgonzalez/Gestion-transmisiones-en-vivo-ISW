import { AppDataSource } from '../../config/data-source.js';
import { AppError } from '../../utils/AppError.js';

const repo = AppDataSource.getRepository('Evento');

export const eventoService = {
  async listar() {
    // Retornamos los eventos trayendo los datos del cliente y tipo vinculados
    return await repo.find({ relations: ['cliente', 'tipoEvento'] });
  },
  async obtenerPorId(id) {
    const evento = await repo.findOne({
      where: { id: parseInt(id) },
      relations: ['cliente', 'tipoEvento']
    });
    if (!evento) throw new AppError(404, 'El evento solicitado no existe.');
    return evento;
  },
  async crear(datos) {
    const nuevoEvento = repo.create(datos);
    return await repo.save(nuevoEvento);
  },
  async actualizar(id, datos) {
    const evento = await this.obtenerPorId(id);
    repo.merge(evento, datos);
    return await repo.save(evento);
  },
  async eliminar(id) {
    const evento = await this.obtenerPorId(id);
    await repo.remove(evento);
    return true;
  }
};
