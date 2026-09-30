import { EntitySchema } from 'typeorm';

export const EventoKit = new EntitySchema({
  name: 'EventoKit',
  tableName: 'evento_kit',
  columns: {
    evento_id: { primary: true, type: 'int' },
    kit_id: { primary: true, type: 'int' },
    cantidad: { type: 'int', nullable: false, default: 1 }
  },
  relations: {
    evento: { type: 'many-to-one', target: 'Evento', joinColumn: { name: 'evento_id' }, inverseSide: 'eventoKits' },
    kit: { type: 'many-to-one', target: 'Kit', joinColumn: { name: 'kit_id' }, inverseSide: 'eventoKits' }
  }
});
