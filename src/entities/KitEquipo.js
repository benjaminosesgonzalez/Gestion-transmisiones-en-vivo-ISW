import { EntitySchema } from 'typeorm';

export const KitEquipo = new EntitySchema({
  name: 'KitEquipo',
  tableName: 'kit_equipo',
  columns: {
    kit_id: { primary: true, type: 'int' },
    equipo_id: { primary: true, type: 'int' },
    cantidad: { type: 'int', nullable: false, default: 1 }
  },
  relations: {
    kit: { type: 'many-to-one', target: 'Kit', joinColumn: { name: 'kit_id' }, inverseSide: 'kitEquipos' },
    equipo: { type: 'many-to-one', target: 'Equipo', joinColumn: { name: 'equipo_id' }, inverseSide: 'kitEquipos' }
  }
});
