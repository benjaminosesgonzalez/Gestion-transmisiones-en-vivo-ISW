import { EntitySchema } from 'typeorm';

export const Perdida = new EntitySchema({
  name: 'Perdida',
  tableName: 'perdida',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    evento_id: { type: 'int', nullable: false },
    equipo_id: { type: 'int', nullable: false },
    descripcion: { type: 'text', nullable: false },
    monto: { type: 'decimal', precision: 12, scale: 2, nullable: false },
    fecha: { type: 'date', nullable: false },
  },
  relations: {
    evento: {
      type: 'many-to-one',
      target: 'Evento',
      joinColumn: { name: 'evento_id' },
    },
    equipo: {
      type: 'many-to-one',
      target: 'Equipo',
      joinColumn: { name: 'equipo_id' },
    },
    distribucionesPago: {
      type: 'one-to-many',
      target: 'DistribucionPago',
      inverseSide: 'perdida',
    },
  },
});
