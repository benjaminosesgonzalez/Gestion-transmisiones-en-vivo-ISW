import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando inyección masiva de la Seed Global...');

  // 1. USUARIOS (Autenticación)
  console.log('-> Poblando Usuarios...');
  const hashJefe = await bcrypt.hash('Admin1234!', 10);
  const hashTecnico = await bcrypt.hash('Tecnico1234!', 10);
  const hashContador = await bcrypt.hash('Contador1234!', 10);

  const jefe = await prisma.usuario.upsert({
    where: { email: 'jefe@productora.com' },
    update: {},
    create: { nombre: 'Jefe de Producción', email: 'jefe@productora.com', password: hashJefe, rol: 'JEFE' }
  });

  await prisma.usuario.upsert({
    where: { email: 'tecnico@productora.com' },
    update: {},
    create: { nombre: 'Jefe Técnico Logístico', email: 'tecnico@productora.com', password: hashTecnico, rol: 'JEFE_TECNICO' }
  });

  await prisma.usuario.upsert({
    where: { email: 'contador@productora.com' },
    update: {},
    create: { nombre: 'Auditor Contable', email: 'contador@productora.com', password: hashContador, rol: 'CONTADOR' }
  });

  // 2. CLIENTES
  console.log('-> Poblando Clientes...');
  const cliente1 = await prisma.cliente.create({
    data: { nombre: 'Asociación Nacional de Fútbol', telefono: '+56911111111', rut: '70.123.456-7', razonSocial: 'ANFP SpA', direccion: 'Santiago, Chile' }
  });

  // 3. FUNCIONES TÉCNICAS
  console.log('-> Poblando Funciones...');
  const fCamara = await prisma.funcion.upsert({ where: { nombre: 'CAMARA' }, update: {}, create: { nombre: 'CAMARA', descripcion: 'Operador de cámara' } });
  const fAudio = await prisma.funcion.upsert({ where: { nombre: 'AUDIO' }, update: {}, create: { nombre: 'AUDIO', descripcion: 'Técnico de Sonido' } });
  const fSwitch = await prisma.funcion.upsert({ where: { nombre: 'SWITCH' }, update: {}, create: { nombre: 'SWITCH', descripcion: 'Director de Switch' } });
  const fInstalacion = await prisma.funcion.upsert({ where: { nombre: 'INSTALACION_TECNICA' }, update: {}, create: { nombre: 'INSTALACION_TECNICA', descripcion: 'Soporte de redes' } });

  // 4. OPERADORES
  console.log('-> Poblando Operadores...');
  const op1 = await prisma.operador.create({
    data: { nombre: 'Juan Pérez', rut: '18.123.456-1', telefono: '+56922222222', email: 'juan.perez@operador.com', estado: 'ACTIVO' }
  });
  const op2 = await prisma.operador.create({
    data: { nombre: 'Andrés Silva', rut: '19.345.678-9', telefono: '+56933333333', email: 'andres.silva@operador.com', estado: 'ACTIVO' }
  });

  // Habilidades de operadores (Intermedia OperadorFuncion)
  await prisma.operadorFuncion.createMany({
    data: [
      { operadorId: op1.id, funcionId: fCamara.id },
      { operadorId: op1.id, funcionId: fAudio.id },
      { operadorId: op2.id, funcionId: fSwitch.id },
      { operadorId: op2.id, funcionId: fInstalacion.id }
    ]
  });

  // 5. AUSENCIAS (Simulación histórica)
  await prisma.ausencia.create({
    data: { operadorId: op1.id, fechaInicio: new Date('2026-05-01T00:00:00Z'), fechaFin: new Date('2026-05-05T00:00:00Z'), motivo: 'Vacaciones' }
  });

  // 6. CATEGORÍAS DE INVENTARIO Y EQUIPOS FÍSICOS
  console.log('-> Poblando Inventario...');
  const catCamara = await prisma.tipoEquipo.upsert({ where: { nombre: 'CAMARAS' }, update: {}, create: { nombre: 'CAMARAS' } });
  const catVideo = await prisma.tipoEquipo.upsert({ where: { nombre: 'COMPUTACION Y VIDEO' }, update: {}, create: { nombre: 'COMPUTACION Y VIDEO' } });

  const equipo1 = await prisma.equipo.create({ data: { tipoId: catCamara.id, nombre: 'Sony Alpha 7 IV', estado: 'DISPONIBLE', valorReposicion: 2500000 } });
  const equipo2 = await prisma.equipo.create({ data: { tipoId: catCamara.id, nombre: 'Lente G-Master 24-70mm', estado: 'DISPONIBLE', valorReposicion: 1800000 } });
  const equipo3 = await prisma.equipo.create({ data: { tipoId: catVideo.id, nombre: 'Switcher ATEM Mini Pro', estado: 'DISPONIBLE', valorReposicion: 600000 } });

  // 7. KITS LOGÍSTICOS
  console.log('-> Poblando Kits...');
  const kitBasico = await prisma.kit.upsert({
    where: { nombre: 'KIT TRANSMISION BASICO' },
    update: {},
    create: { nombre: 'KIT TRANSMISION BASICO', descripcion: 'Kit esencial para coberturas de un solo operador' }
  });

  await prisma.kitEquipo.createMany({
    data: [
      { kitId: kitBasico.id, equipoId: equipo1.id, cantidad: 1 },
      { kitId: kitBasico.id, equipoId: equipo2.id, cantidad: 1 }
    ]
  });

  // 8. EMPRESAS AUSPICIADORAS
  const auspiciador = await prisma.empresaAuspiciadora.create({
    data: { nombre: 'Entel Chile', contacto: 'convenios@entel.cl' }
  });

  // 9. EVENTO CON DURACIÓN SUPERIOR A 5 HORAS (Dispara pagos automáticos)
  console.log('-> Poblando Transmisiones y Reglas de Negocio...');
  const eventoMuestra = await prisma.evento.create({
    data: {
      clienteId: cliente1.id,
      nombre: 'Gran Final Campeonato Nacional',
      tipo: 'PARTIDO',
      fecha: new Date('2026-11-25T00:00:00Z'),
      horaInicio: new Date('1970-01-01T12:00:00Z'),
      horaFin: new Date('1970-01-01T18:30:00Z'), // 6.5 Horas de duración (> 5 horas)
      zona: 'Estadio Nacional',
      valorTotal: 1000000, // $1.000.000 COP/CLP
      porcentajeUtilidad: 35.00,
      esRentable: true,
      estado: 'PROGRAMADO',
      notas: 'Producción de alta definición'
    }
  });

  // SIMULACIÓN DE DISPARADOR MANUAL EN SEED DE DEUDA CLIENTE (Cumple con las reglas del service de la Fase 4)
  const montoAnticipo = 500000; // 50%
  const montoSaldo = 500000; // 50%
  const fechaAnticipo = new Date(eventoMuestra.fecha);
  fechaAnticipo.setDate(fechaAnticipo.getDate() - 5);

  const pago1 = await prisma.pago.create({
    data: { eventoId: eventoMuestra.id, montoTotal: montoAnticipo, tipoPago: 'ANTICIPO', estadoPago: 'PAGADO', fechaEsperada: fechaAnticipo }
  });
  await prisma.pago.create({
    data: { eventoId: eventoMuestra.id, montoTotal: montoSaldo, tipoPago: 'SALDO_TOTAL', estadoPago: 'PENDIENTE', fechaEsperada: eventoMuestra.fecha }
  });

  // Abono asociado al pago liquidado
  await prisma.pagoAbono.create({
    data: { pagoId: pago1.id, monto: 500000, fechaPago: fechaAnticipo, metodoPago: 'TRANSFERENCIA' }
  });

  // 10. ASIGNACIÓN OPERATIVA DE PERSONAL CON FUNCIÓN CUMPLIDA
  const asignacion1 = await prisma.asignacion.create({
    data: { eventoId: eventoMuestra.id, operadorId: op1.id, horaInicio: eventoMuestra.horaInicio, horaFin: eventoMuestra.horaFin, observacion: 'Camarógrafo principal' }
  });
  await prisma.asignacionFuncion.create({
    data: { asignacionId: asignacion1.id, funcionId: fCamara.id }
  });

  // 11. DESPACHOS FÍSICOS (Tablas intermedias EventoEquipo y EventoKit)
  await prisma.eventoEquipo.create({ data: { eventoId: eventoMuestra.id, equipoId: equipo3.id, cantidad: 1 } });
  await prisma.eventoKit.create({ data: { eventoId: eventoMuestra.id, kitId: kitBasico.id, cantidad: 1 } });

  // 12. GASTOS OPERACIONALES ASOCIADOS
  await prisma.gasto.create({ data: { eventoId: eventoMuestra.id, descripcion: 'Viáticos de alimentación personal técnico', monto: 45000, fecha: eventoMuestra.fecha } });

  // 13. AUSPICIOS ASOCIADOS
  await prisma.auspicio.create({ data: { eventoId: eventoMuestra.id, empresaAuspiciadoraId: auspiciador.id, monto: 150000 } });

  // 14. INCIDENTES Y LIQUIDACIONES DE CIERRE FINANCIERO
  const perdidaIncidente = await prisma.perdida.create({
    data: { eventoId: eventoMuestra.id, equipoId: equipo1.id, descripcion: 'Trípode con trizaduras leves en pata de apoyo', monto: 25000, fecha: eventoMuestra.fecha }
  });

  await prisma.distribucionPago.create({
    data: {
      eventoId: eventoMuestra.id,
      operadorId: op1.id,
      perdidaId: perdidaIncidente.id,
      monto: 85000, // Monto neto posterior al descuento aplicado por el Contador
      porcentaje: null, // Monto fijo por jornada
      fechaDistribucion: eventoMuestra.fecha,
      estado: 'LIQUIDADO'
    }
  });

  console.log(' Base de datos poblada de forma íntegra sin fallos relacionales.');
}

main()
  .catch((e) => { console.error(' Error fatal en el flujo relacional de la Seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
