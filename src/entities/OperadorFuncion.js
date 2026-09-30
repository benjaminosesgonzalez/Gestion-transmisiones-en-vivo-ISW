import { EntitySchema } from 'typeorm';

export const OperadorFuncion = new EntitySchema({
  name: 'OperadorFuncion',
  tableName: 'operador_funcion',
  columns: {
    operador_id: {
      primary: true,
      type: 'int',
    },
    funcion_id: {
      primary: true,
      type: 'int',
    },
  },
  relations: {
    operador: {
      type: 'many-to-one',
      target: 'Operador',
      joinColumn: { name: 'operador_id' },
      onDelete: 'CASCADE',
    },
    funcion: {
      type: 'many-to-one',
      target: 'Funcion',
      joinColumn: { name: 'funcion_id' },
      onDelete: 'CASCADE',
    },
  },
});
