import { EntitySchema } from 'typeorm';

export const Gasto = new EntitySchema({
  name: 'Gasto',
  tableName: 'gasto',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    evento_id: { type: 'int', nullable: false },
    descripcion: { type: 'varchar', length: 255, nullable: false },
    monto: { type: 'decimal', precision: 12, scale: 2, nullable: false },
    fecha: { type: 'date', nullable: false }
  },
  relations: {
    evento: { type: 'many-to-one', target: 'Evento', joinColumn: { name: 'evento_id' }, inverseSide: 'gastos' }
  }
});
