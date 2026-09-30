import { EntitySchema } from 'typeorm';

export const Operador = new EntitySchema({
  name: 'Operador',
  tableName: 'operador',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar', length: 120, nullable: false },
    rut: { type: 'varchar', length: 12, nullable: true },
    telefono: { type: 'varchar', length: 20, nullable: true },
    email: { type: 'varchar', length: 100, nullable: true },
    estado: { type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' }
  },
  relations: {
    ausencias: { type: 'one-to-many', target: 'Ausencia', inverseSide: 'operador' },
    asignaciones: { type: 'one-to-many', target: 'Asignacion', inverseSide: 'operador' }
  }
});
