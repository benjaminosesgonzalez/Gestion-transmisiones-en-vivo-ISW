import { EntitySchema } from 'typeorm';

export const DistribucionPago = new EntitySchema({
  name: 'DistribucionPago',
  tableName: 'distribucion_pago',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    evento_id: { type: 'int', nullable: false },
    operador_id: { type: 'int', nullable: false },
    perdida_id: { type: 'int', nullable: true },
    monto: { type: 'numeric', precision: 12, scale: 2, nullable: false },
    porcentaje: { type: 'numeric', precision: 5, scale: 2, nullable: false },
    fecha_distribucion: { type: 'date', nullable: false },
    estado: { 
      type: 'enum',
      enum: ['PENDIENTE', 'APROBADO', 'LIQUIDADO', 'RETENIDO'],
      default: 'PENDIENTE',
      nullable: false,
    }
  },
  relations: {
    evento: { type: 'many-to-one', target: 'Evento', joinColumn: { name: 'evento_id' } },
    operador: { type: 'many-to-one', target: 'Operador', joinColumn: { name: 'operador_id' } },
    perdida: { type: 'many-to-one', target: 'Perdida', joinColumn: { name: 'perdida_id' } }
  }
});
