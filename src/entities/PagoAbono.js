import { EntitySchema } from 'typeorm';

export const PagoAbono = new EntitySchema({
  name: 'PagoAbono',
  tableName: 'pago_abono',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    pago_id: { type: 'int', nullable: false },
    monto: { type: 'decimal', precision: 12, scale: 2, nullable: false },
    fecha_pago: { type: 'date', nullable: false },
    metodo_pago: { type: 'enum', enum: ['TRANSFERENCIA', 'EFECTIVO', 'TARJETA'], nullable: false }
  },
  relations: {
    pago: { type: 'many-to-one', target: 'Pago', joinColumn: { name: 'pago_id' }, inverseSide: 'abonos' }
  }
});
