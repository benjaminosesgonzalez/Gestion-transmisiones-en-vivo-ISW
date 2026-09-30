import { EntitySchema } from 'typeorm';

export const Kit = new EntitySchema({
  name: 'Kit',
  tableName: 'kit',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar', length: 150, nullable: false },
    descripcion: { type: 'text', nullable: true }
  },
  relations: {
    kitEquipos: { type: 'one-to-many', target: 'KitEquipo', inverseSide: 'kit' },
    eventoKits: { type: 'one-to-many', target: 'EventoKit', inverseSide: 'kit' }
  }
});
