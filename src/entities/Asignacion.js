import { EntitySchema } from 'typeorm';

export const Asignacion = new EntitySchema({
  name: 'Asignacion',
  tableName: 'asignacion',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    hora_inicio: {
      type: 'time',
      nullable: false,
    },
    hora_fin: {
      type: 'time',
      nullable: false,
    },
    observacion: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
  },
  relations: {
    evento: {
      target: 'Evento',
      type: 'many-to-one',
      joinColumn: { name: 'evento_id' },
      nullable: false,
      onDelete: 'CASCADE',
    },
    operador: {
      target: 'Operador',
      type: 'many-to-one',
      joinColumn: { name: 'operador_id' },
      nullable: false,
      onDelete: 'RESTRICT',
    },
    asignacionFunciones: {
      target: 'AsignacionFuncion',
      type: 'one-to-many',
      inverseSide: 'asignacion',
    },
  },
});
