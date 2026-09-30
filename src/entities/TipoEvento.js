import { EntitySchema } from 'typeorm';

export const TipoEvento = new EntitySchema({
  name: 'TipoEvento',
  tableName: 'tipo_evento',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
  },
  relations: {
    eventos: {
      type: 'one-to-many',
      target: 'Evento',
      inverseSide: 'tipoEvento',
    },
  },
});
