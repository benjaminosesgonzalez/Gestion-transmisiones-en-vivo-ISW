import { EntitySchema } from 'typeorm';

export const Auspicio = new EntitySchema({
  name: 'Auspicio',
  tableName: 'auspicio',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    evento_id: { type: 'int', nullable: false },
    empresa_auspiciadora_id: { type: 'int', nullable: false },
    monto: { type: 'decimal', precision: 12, scale: 2, nullable: false }
  },
  relations: {
    evento: { type: 'many-to-one', target: 'Evento', joinColumn: { name: 'evento_id' }, inverseSide: 'auspicios' },
    empresaAuspiciadora: { type: 'many-to-one', target: 'EmpresaAuspiciadora', joinColumn: { name: 'empresa_auspiciadora_id' }, inverseSide: 'auspicios' }
  }
});
