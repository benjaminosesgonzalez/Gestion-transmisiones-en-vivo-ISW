import { EntitySchema } from 'typeorm';

export const Cliente = new EntitySchema({
  name: 'Cliente',
  tableName: 'cliente',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 150,
      nullable: false,
    },
    telefono: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    rut: {
      type: 'varchar',
      length: 12,
      nullable: true,
    },
    razon_social: {
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    direccion: {
      type: 'varchar',
      length: 255,
      nullable: true,
    }
  },
  relations: {
    eventos: {
      type: 'one-to-many',
      target: 'Evento',
      inverseSide: 'cliente',
    }
  }
});
