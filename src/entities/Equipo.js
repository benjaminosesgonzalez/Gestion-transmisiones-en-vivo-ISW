import { EntitySchema } from 'typeorm';

export const Equipo = new EntitySchema({
  name: 'Equipo',
  tableName: 'equipo',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    tipo_id: {
      type: 'int',
      nullable: false,
    },
    nombre: {
      type: 'varchar',
      length: 150,
      nullable: false,
    },
    estado: {
      type: 'enum',
      enum: ['OPERATIVO', 'EN_REPARACION', 'EXTRAVIADO', 'DE_BAJA'],
      default: 'OPERATIVO',
      nullable: false,
    },
    valor_reposicion: { 
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: true,   
    },
  },
  relations: {
    tipoEquipo: {
      type: 'many-to-one',
      target: 'TipoEquipo',
      joinColumn: { name: 'tipo_id' },
      onDelete: 'NO ACTION',
    },
    kitEquipos: {
      type: 'one-to-many',
      target: 'KitEquipo',
      inverseSide: 'equipo',
    },
    eventoEquipos: {
      type: 'one-to-many',
      target: 'EventoEquipo',
      inverseSide: 'equipo',
    },
    perdidas: {
      type: 'one-to-many',
      target: 'Perdida',
      inverseSide: 'equipo',
    },
  },
});
