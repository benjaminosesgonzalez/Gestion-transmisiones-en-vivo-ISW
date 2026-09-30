import { EntitySchema } from 'typeorm';

export const Evento = new EntitySchema({
  name: 'Evento',
  tableName: 'evento',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    cliente_id: {
      type: 'int',
      nullable: false,
    },
    tipo_id: {
      type: 'int',
      nullable: false,
    },
    nombre: {
      type: 'varchar',
      length: 150,
      nullable: false,
    },
    fecha: {
      type: 'date',
      nullable: false,
    },
    hora_inicio: {
      type: 'time',
      nullable: false,
    },
    hora_fin: {
      type: 'time',
      nullable: false,
    },
    zona: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    valor_total: {
      type: 'decimal',
      precision: 12,
      scale: 2,
      nullable: false,
    },
    porcentaje_utilidad: {
      type: 'decimal',
      precision: 5,
      scale: 2,
      nullable: false,
    },
    es_rentable: {
      type: 'boolean',
      nullable: true,
    },
    estado: { 
      type: 'enum', 
      enum: ['PROGRAMADO', 'FINALIZADO', 'CANCELADO'], 
      default: 'PROGRAMADO',
    },

    notas: {
      type: 'text',
      nullable: true,
    },
  },
  relations: {
    cliente: {
      type: 'many-to-one',
      target: 'Cliente',
      joinColumn: { name: 'cliente_id' },
      inverseSide: 'eventos',
    },
    tipoEvento: {
      type: 'many-to-one',
      target: 'TipoEvento',
      joinColumn: { name: 'tipo_id' },
      inverseSide: 'eventos',
    },
    asignaciones: {
      type: 'one-to-many',
      target: 'Asignacion',
      inverseSide: 'evento',
    },
    pagos: {
      type: 'one-to-many',
      target: 'Pago',
      inverseSide: 'evento',
    },
    auspicios: {
      type: 'one-to-many',
      target: 'Auspicio',
      inverseSide: 'evento',
    },
    gastos: {
      type: 'one-to-many',
      target: 'Gasto',
      inverseSide: 'evento',
    },
    distribucionesPago: {
      type: 'one-to-many',
      target: 'DistribucionPago',
      inverseSide: 'evento',
    },
  },
});
