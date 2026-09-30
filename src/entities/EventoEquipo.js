import { EntitySchema } from 'typeorm';

export const EventoEquipo = new EntitySchema({
  name: 'EventoEquipo',
  tableName: 'evento_equipo',
  columns: {
    evento_id: { primary: true, type: 'int' },
    equipo_id: { primary: true, type: 'int' },
    cantidad: { type: 'int', nullable: false, default: 1 }
  },
  relations: {
    evento: { type: 'many-to-one', target: 'Evento', joinColumn: { name: 'evento_id' } },
    equipo: { type: 'many-to-one', target: 'Equipo', joinColumn: { name: 'equipo_id' }, inverseSide: 'eventoEquipos' }
  }
});
