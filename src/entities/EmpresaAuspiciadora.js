import { EntitySchema } from 'typeorm';

export const EmpresaAuspiciadora = new EntitySchema({
  name: 'EmpresaAuspiciadora',
  tableName: 'empresa_auspiciadora',
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
    contacto: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
  },
  relations: {
    auspicios: {
      type: 'one-to-many',
      target: 'Auspicio',
      inverseSide: 'empresaAuspiciadora',
    },
  },
});
