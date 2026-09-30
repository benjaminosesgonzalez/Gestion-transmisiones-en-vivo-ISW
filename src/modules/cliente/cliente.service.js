import { AppDataSource } from '../../config/data-source.js';
import { AppError } from '../../utils/AppError.js';

const clienteRepository = AppDataSource.getRepository('Cliente');

export const clienteService = {
  async listar() {
    return await clienteRepository.find();
  },

  async obtenerPorId(id) {
    const cliente = await clienteRepository.findOneBy({ id: parseInt(id) });
    if (!cliente) {
      throw new AppError(404, `El cliente con ID ${id} no existe en el sistema.`);
    }
    return cliente;
  },

  async crear(datos) {
    const nuevoCliente = clienteRepository.create(datos);
    return await clienteRepository.save(nuevoCliente);
  },

  async actualizar(id, datos) {
    const cliente = await this.obtenerPorId(id);
    clienteRepository.merge(cliente, datos);
    return await clienteRepository.save(cliente);
  },

  async eliminar(id) {
    const cliente = await this.obtenerPorId(id);
    await clienteRepository.remove(cliente);
    return true;
  }
};
