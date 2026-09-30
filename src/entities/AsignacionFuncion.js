import { EntitySchema } from 'typeorm';

export const AsignacionFuncion = new EntitySchema({
  name: 'AsignacionFuncion',
  tableName: 'asignacion_funcion',
  columns: {
    asignacion_id: { primary: true, type: 'int' },
    funcion_id: { primary: true, type: 'int' }
  },
  relations: {
    asignacion: { type: 'many-to-one', target: 'Asignacion', joinColumn: { name: 'asignacion_id' }, inverseSide: 'asignacionFunciones' },
    funcion: { type: 'many-to-one', target: 'Funcion', joinColumn: { name: 'funcion_id' }, inverseSide: 'asignacionFunciones' }
  }
});
