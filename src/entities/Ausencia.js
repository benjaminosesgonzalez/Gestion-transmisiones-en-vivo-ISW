import { EntitySchema } from 'typeorm';

export const Ausencia = new EntitySchema({
  name: 'Ausencia',
  tableName: 'ausencia',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    operador_id: { type: 'int', nullable: false },
    fecha_inicio: { type: 'date', nullable: false },
    fecha_fin: { type: 'date', nullable: false },
    motivo: { type: 'varchar', length: 255, nullable: true }
  },
  relations: {
    operador: { type: 'many-to-one', target: 'Operador', joinColumn: { name: 'operador_id' }, inverseSide: 'ausencias' }
  }
});
