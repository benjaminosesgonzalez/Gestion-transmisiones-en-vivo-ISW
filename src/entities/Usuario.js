import { EntitySchema } from 'typeorm';
 
export const Usuario = new EntitySchema({
  name: 'Usuario',
  tableName: 'usuario',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 120,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 160,
      nullable: false,
      unique: true,
    },
    password: {
      type: 'varchar',
      length: 100,
      nullable: false,
      select: false,
    },
    rol: {
      type: 'enum',
      enum: ['JEFE', 'JEFE_TECNICO', 'CONTADOR'],
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
  },
});
