import { EntitySchema } from 'typeorm';

export const TipoEquipo = new EntitySchema({
  name: 'TipoEquipo',
  tableName: 'tipo_equipo',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar', length: 100, nullable: false }
  },
  relations: {
    equipos: { type: 'one-to-many', target: 'Equipo', inverseSide: 'tipoEquipo' }
  }
});
