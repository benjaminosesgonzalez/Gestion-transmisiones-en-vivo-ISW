import { EntitySchema } from 'typeorm';

export const Pago = new EntitySchema({
  name: 'Pago',
  tableName: 'pago',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    evento_id: {
      type: 'int',
      nullable: false,
    },
    monto_total: {
      type: 'numeric',
      precision: 12,
      scale: 2,
      nullable: false,
    },
    tipo_pago: {
      type: 'enum',
      enum: ['ANTICIPO', 'SALDO_TOTAL', 'ABONO'],
      nullable: false,
    },
    estado_pago: {
      type: 'enum',
      enum: ['PENDIENTE', 'PAGADO', 'RECHAZADO'],
      default: 'PENDIENTE',
      nullable: false,
    },
    fecha_esperada: { // ◄ COLUMNA AGREGADA SEGÚN EL DIAGRAMA
      type: 'date',
      nullable: false, 
    },
  },
  relations: {
    evento: {
      type: 'many-to-one',
      target: 'Evento',
      joinColumn: { name: 'evento_id' },
      onDelete: 'NO ACTION',
    },
    abonos: {
      type: 'one-to-many',
      target: 'PagoAbono',
      inverseSide: 'pago',
    },
  },
});
