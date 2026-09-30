import { EntitySchema } from 'typeorm';

export const Funcion = new EntitySchema({
  name: 'Funcion',
  tableName: 'funcion',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar', length: 100, nullable: false },
    descripcion: { type: 'text', nullable: true }
  },
  relations: {
    asignacionFunciones: { type: 'one-to-many', target: 'AsignacionFuncion', inverseSide: 'funcion' }
  }
});
