import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando poblado masivo de base de datos...');

  // 1. USUARIOS (1 Jefe, 1 Jefe Técnico y 1 Contador)
  const hashJefe = await bcrypt.hash('Admin1234!', 10);
  const hashTecnico = await bcrypt.hash('Tecnico1234!', 10);
  const hashContador = await bcrypt.hash('Contador1234!', 10);

  await prisma.usuario.upsert({
    where: { email: 'jefe@productora.com' },
    update: {},
    create: { nombre: 'Jefe de Producción', email: 'jefe@productora.com', password: hashJefe, rol: 'JEFE' },
  });

  await prisma.usuario.upsert({
    where: { email: 'tecnico@productora.com' },
    update: {},
    create: { nombre: 'Jefe Técnico Logístico', email: 'tecnico@productora.com', password: hashTecnico, rol: 'JEFE_TECNICO' },
  });

  await prisma.usuario.upsert({
    where: { email: 'contador@productora.com' },
    update: {},
    create: { nombre: 'Auditor Contable', email: 'contador@productora.com', password: hashContador, rol: 'CONTADOR' },
  });

  // 2. FUNCIONES TÉCNICAS
  const nombresFunciones = [
    { nombre: 'CAMARA', descripcion: 'Operador de cámara profesional' },
    { nombre: 'AUDIO', descripcion: 'Sonidista y microfonía en vivo' },
    { nombre: 'SWITCH', descripcion: 'Director de mesa de video' },
    { nombre: 'INSTALACION_TECNICA', descripcion: 'Redes, fibra y cableado' },
    { nombre: 'ILUMINACION', descripcion: 'Diseño y control de luces' },
  ];

  const funcionesMap = {};
  for (const f of nombresFunciones) {
    const creada = await prisma.funcion.upsert({
      where: { nombre: f.nombre },
      update: {},
      create: f,
    });
    funcionesMap[f.nombre] = creada.id;
  }

  // 3. 15 OPERADORES CON SUS ESPECIALIDADES
  const datosOperadores = [
    { nombre: 'Juan Pérez', rut: '18.123.456-1', telefono: '+56911110001', email: 'juan.perez@op.cl', funcs: ['CAMARA', 'AUDIO'] },
    { nombre: 'Andrés Silva', rut: '19.345.678-9', telefono: '+56911110002', email: 'andres.silva@op.cl', funcs: ['SWITCH', 'INSTALACION_TECNICA'] },
    { nombre: 'Camila Rojas', rut: '20.112.334-5', telefono: '+56911110003', email: 'camila.rojas@op.cl', funcs: ['CAMARA', 'ILUMINACION'] },
    { nombre: 'Felipe Morales', rut: '17.889.900-2', telefono: '+56911110004', email: 'felipe.morales@op.cl', funcs: ['AUDIO', 'INSTALACION_TECNICA'] },
    { nombre: 'Valentina Muñoz', rut: '21.445.667-8', telefono: '+56911110005', email: 'valentina.munoz@op.cl', funcs: ['SWITCH', 'CAMARA'] },
    { nombre: 'Matías Castro', rut: '18.776.543-0', telefono: '+56911110006', email: 'matias.castro@op.cl', funcs: ['CAMARA'] },
    { nombre: 'Sebastián Vargas', rut: '16.554.321-K', telefono: '+56911110007', email: 'sebastian.vargas@op.cl', funcs: ['ILUMINACION', 'INSTALACION_TECNICA'] },
    { nombre: 'Javiera Soto', rut: '19.998.877-6', telefono: '+56911110008', email: 'javiera.soto@op.cl', funcs: ['AUDIO'] },
    { nombre: 'Diego Contreras', rut: '20.332.119-4', telefono: '+56911110009', email: 'diego.contreras@op.cl', funcs: ['CAMARA', 'SWITCH'] },
    { nombre: 'Constanza Fuentes', rut: '18.665.432-3', telefono: '+56911110010', email: 'constanza.fuentes@op.cl', funcs: ['ILUMINACION'] },
    { nombre: 'Nicolás Sepúlveda', rut: '17.223.445-1', telefono: '+56911110011', email: 'nicolas.sepulveda@op.cl', funcs: ['INSTALACION_TECNICA'] },
    { nombre: 'Fernanda Reyes', rut: '21.009.887-5', telefono: '+56911110012', email: 'fernanda.reyes@op.cl', funcs: ['CAMARA', 'AUDIO'] },
    { nombre: 'Cristóbal Herrera', rut: '19.112.233-7', telefono: '+56911110013', email: 'cristobal.herrera@op.cl', funcs: ['SWITCH'] },
    { nombre: 'Daniela Araya', rut: '20.778.899-2', telefono: '+56911110014', email: 'daniela.araya@op.cl', funcs: ['AUDIO', 'ILUMINACION'] },
    { nombre: 'Gonzalo Tapia', rut: '16.990.112-8', telefono: '+56911110015', email: 'gonzalo.tapia@op.cl', funcs: ['CAMARA', 'INSTALACION_TECNICA'] },
  ];

  const operadoresCreados = [];
  for (const op of datosOperadores) {
    const creado = await prisma.operador.create({
      data: { nombre: op.nombre, rut: op.rut, telefono: op.telefono, email: op.email, estado: 'ACTIVO' },
    });
    operadoresCreados.push(creado);

    await prisma.operadorFuncion.createMany({
      data: op.funcs.map((fnName) => ({
        operadorId: creado.id,
        funcionId: funcionesMap[fnName],
      })),
    });
  }

  // Ausencias de muestra
  await prisma.ausencia.createMany({
    data: [
      { operadorId: operadoresCreados.at(2).id, fechaInicio: new Date('2026-11-15T00:00:00Z'), fechaFin: new Date('2026-11-18T00:00:00Z'), motivo: 'Licencia médica' },
      { operadorId: operadoresCreados.at(5).id, fechaInicio: new Date('2026-12-01T00:00:00Z'), fechaFin: new Date('2026-12-07T00:00:00Z'), motivo: 'Vacaciones anuales' },
    ],
  });

  // 4. CATEGORÍAS Y 22 EQUIPOS FÍSICOS
  const categoriasNombres = ['CAMARAS', 'AUDIO', 'ILUMINACION', 'COMPUTACION Y VIDEO', 'REDES Y TRANSMISION'];
  const catMap = {};
  for (const cNombre of categoriasNombres) {
    const cat = await prisma.tipoEquipo.upsert({
      where: { nombre: cNombre },
      update: {},
      create: { nombre: cNombre },
    });
    catMap[cNombre] = cat.id;
  }

  const listaEquipos = [
    { tipo: 'CAMARAS', nombre: 'Sony FX9 Cinema Line', estado: 'DISPONIBLE', valor: 8500000 },
    { tipo: 'CAMARAS', nombre: 'Sony Alpha 7 IV Body', estado: 'DISPONIBLE', valor: 2400000 },
    { tipo: 'CAMARAS', nombre: 'Blackmagic URSA Broadcast G2', estado: 'DISPONIBLE', valor: 6200000 },
    { tipo: 'CAMARAS', nombre: 'Lente Sony G-Master 24-70mm', estado: 'DISPONIBLE', valor: 1900000 },
    { tipo: 'CAMARAS', nombre: 'Lente Sony G-Master 70-200mm', estado: 'DISPONIBLE', valor: 2300000 },
    { tipo: 'CAMARAS', nombre: 'Trípode Manfrotto Heavy Duty', estado: 'DANADO', valor: 650000 },
    { tipo: 'AUDIO', nombre: 'Consola Digital Behringer X32', estado: 'DISPONIBLE', valor: 2800000 },
    { tipo: 'AUDIO', nombre: 'Sistema Inalámbrico Sennheiser EW-D', estado: 'DISPONIBLE', valor: 950000 },
    { tipo: 'AUDIO', nombre: 'Micrófono Shotgun Rode NTG5', estado: 'DISPONIBLE', valor: 520000 },
    { tipo: 'AUDIO', nombre: 'Intercomunicador Hollyland Solidcom C1', estado: 'DISPONIBLE', valor: 1400000 },
    { tipo: 'ILUMINACION', nombre: 'Foco LED Aputure 600d Pro', estado: 'DISPONIBLE', valor: 1850000 },
    { tipo: 'ILUMINACION', nombre: 'Panel LED Amaran P60c RGB', estado: 'DISPONIBLE', valor: 420000 },
    { tipo: 'ILUMINACION', nombre: 'Softbox Aputure Light Dome II', estado: 'DISPONIBLE', valor: 250000 },
    { tipo: 'ILUMINACION', nombre: 'Controlador DMX Chauvet Obey 70', estado: 'DISPONIBLE', valor: 310000 },
    { tipo: 'COMPUTACION Y VIDEO', nombre: 'Switcher ATEM Television Studio HD8', estado: 'DISPONIBLE', valor: 3500000 },
    { tipo: 'COMPUTACION Y VIDEO', nombre: 'Switcher ATEM Mini Extreme ISO', estado: 'DISPONIBLE', valor: 1200000 },
    { tipo: 'COMPUTACION Y VIDEO', nombre: 'Monitor Director Atomos Sumo 19', estado: 'DISPONIBLE', valor: 1950000 },
    { tipo: 'COMPUTACION Y VIDEO', nombre: 'Workstation vMix Pro RTX 4080', estado: 'DISPONIBLE', valor: 3200000 },
    { tipo: 'REDES Y TRANSMISION', nombre: 'Mochila LiveU Solo Pro 5G', estado: 'DISPONIBLE', valor: 2100000 },
    { tipo: 'REDES Y TRANSMISION', nombre: 'Enlace Inalámbrico Hollyland Mars 4K', estado: 'DISPONIBLE', valor: 680000 },
    { tipo: 'REDES Y TRANSMISION', nombre: 'Carrete Fibra Óptica SMPTE 150m', estado: 'DISPONIBLE', valor: 890000 },
    { tipo: 'REDES Y TRANSMISION', nombre: 'Router Industrial Peplink Balance', estado: 'EN_USO', valor: 1100000 },
  ];

  const equiposCreados = [];
  for (const eq of listaEquipos) {
    const creado = await prisma.equipo.create({
      data: {
        tipoId: catMap[eq.tipo],
        nombre: eq.nombre,
        estado: eq.estado,
        valorReposicion: eq.valor,
      },
    });
    equiposCreados.push(creado);
  }
  // 5. KITS LOGÍSTICOS
  const kitStreaming = await prisma.kit.create({
    data: { nombre: 'KIT MULTICÁMARA PRO', descripcion: 'Producción HD a 2 cámaras con switcher' },
  });
  await prisma.kitEquipo.createMany({
    data: [
      { kitId: kitStreaming.id, equipoId: equiposCreados.at(0).id, cantidad: 1 },
      { kitId: kitStreaming.id, equipoId: equiposCreados.at(1).id, cantidad: 1 },
      { kitId: kitStreaming.id, equipoId: equiposCreados.at(15).id, cantidad: 1 },
    ],
  });

  const kitAudio = await prisma.kit.create({
    data: { nombre: 'KIT SONIDO Y COMUNICACIÓN', descripcion: 'Consola digital + intercomunicadores' },
  });
  await prisma.kitEquipo.createMany({
    data: [
      { kitId: kitAudio.id, equipoId: equiposCreados.at(6).id, cantidad: 1 },
      { kitId: kitAudio.id, equipoId: equiposCreados.at(9).id, cantidad: 1 },
    ],
  });

  const kitLuces = await prisma.kit.create({
    data: { nombre: 'KIT ILUMINACIÓN SET', descripcion: 'Iluminación principal y relleno RGB' },
  });
  await prisma.kitEquipo.createMany({
    data: [
      { kitId: kitLuces.id, equipoId: equiposCreados.at(10).id, cantidad: 1 },
      { kitId: kitLuces.id, equipoId: equiposCreados.at(11).id, cantidad: 1 },
    ],
  });

  // 6. CLIENTES Y AUSPICIADORES
  const cliAnfp = await prisma.cliente.create({
    data: { nombre: 'Asociación Nacional de Fútbol', rut: '70.123.456-7', razonSocial: 'ANFP SpA', telefono: '+56922221111', direccion: 'Santiago' },
  });
  const cliUdec = await prisma.cliente.create({
    data: { nombre: 'Universidad de Concepción', rut: '81.494.400-K', razonSocial: 'Corporación UdeC', telefono: '+56412204000', direccion: 'Concepción' },
  });
  const cliProductora = await prisma.cliente.create({
    data: { nombre: 'Eventos Sur Producciones', rut: '76.543.210-8', razonSocial: 'Sur Eventos Ltda', telefono: '+56988887777', direccion: 'Hualpén' },
  });
  const cliMuni = await prisma.cliente.create({
    data: { nombre: 'Municipalidad de Talcahuano', rut: '69.150.200-3', razonSocial: 'Ilustre Municipalidad', telefono: '+56412503000', direccion: 'Talcahuano' },
  });

  const auspEntel = await prisma.empresaAuspiciadora.create({ data: { nombre: 'Entel Chile', contacto: 'auspicios@entel.cl' } });
  const auspBanco = await prisma.empresaAuspiciadora.create({ data: { nombre: 'Banco de Chile', contacto: 'marketing@bancochile.cl' } });
  await prisma.empresaAuspiciadora.create({ data: { nombre: 'Red Bull Media', contacto: 'eventos@redbull.com' } });

  // 7. EVENTOS PROGRAMADOS Y FINANZAS
  const ev1 = await prisma.evento.create({
    data: {
      clienteId: cliAnfp.id,
      nombre: 'Gran Final Campeonato Nacional',
      tipo: 'Partido',
      fecha: new Date('2026-11-25T00:00:00Z'),
      horaInicio: new Date('1970-01-01T14:00:00Z'),
      horaFin: new Date('1970-01-01T20:30:00Z'),
      zona: 'Estadio Ester Roa, Concepción',
      valorTotal: 2500000,
      porcentajeUtilidad: 30,
      estado: 'PROGRAMADO',
    },
  });

  const ev2 = await prisma.evento.create({
    data: {
      clienteId: cliUdec.id,
      nombre: 'Congreso Internacional de Ingeniería',
      tipo: 'Conferencia',
      fecha: new Date('2026-11-28T00:00:00Z'),
      horaInicio: new Date('1970-01-01T09:00:00Z'),
      horaFin: new Date('1970-01-01T17:00:00Z'),
      zona: 'Teatro Universidad de Concepción',
      valorTotal: 1800000,
      porcentajeUtilidad: 30,
      estado: 'PROGRAMADO',
    },
  });

  const ev3 = await prisma.evento.create({
    data: {
      clienteId: cliProductora.id,
      nombre: 'Festival Rock en el Biobío',
      tipo: 'Concierto',
      fecha: new Date('2026-12-05T00:00:00Z'),
      horaInicio: new Date('1970-01-01T16:00:00Z'),
      horaFin: new Date('1970-01-01T23:30:00Z'),
      zona: 'Parque Bicentenario',
      valorTotal: 4200000,
      porcentajeUtilidad: 30,
      estado: 'PROGRAMADO',
    },
  });

  const ev4 = await prisma.evento.create({
    data: {
      clienteId: cliMuni.id,
      nombre: 'Gala Aniversario Puerto Talcahuano',
      tipo: 'Corporativo',
      fecha: new Date('2026-12-12T00:00:00Z'),
      horaInicio: new Date('1970-01-01T19:00:00Z'),
      horaFin: new Date('1970-01-01T23:00:00Z'),
      zona: 'Coliseo La Tortuga',
      valorTotal: 1400000,
      porcentajeUtilidad: 30,
      estado: 'PROGRAMADO',
    },
  });

  const ev5 = await prisma.evento.create({
    data: {
      clienteId: cliAnfp.id,
      nombre: 'Clásico Regional Primera B',
      tipo: 'Partido',
      fecha: new Date('2026-11-18T00:00:00Z'),
      horaInicio: new Date('1970-01-01T15:00:00Z'),
      horaFin: new Date('1970-01-01T19:00:00Z'),
      zona: 'Estadio CAP Acero',
      valorTotal: 1200000,
      porcentajeUtilidad: 30,
      estado: 'FINALIZADO',
    },
  });

  // Pagos y Abonos de muestra
  const pagoEv1 = await prisma.pago.create({
    data: { eventoId: ev1.id, montoTotal: 750000, tipoPago: 'ANTICIPO', estadoPago: 'PAGADO', fechaEsperada: new Date('2026-11-20T00:00:00Z') },
  });
  await prisma.pago.create({
    data: { eventoId: ev1.id, montoTotal: 1750000, tipoPago: 'SALDO_TOTAL', estadoPago: 'PENDIENTE', fechaEsperada: new Date('2026-11-25T00:00:00Z') },
  });
  await prisma.pagoAbono.create({
    data: { pagoId: pagoEv1.id, monto: 750000, fechaPago: new Date('2026-11-10T00:00:00Z'), metodoPago: 'TRANSFERENCIA', notas: 'Anticipo 30% confirmado' },
  });

  const pagoEv5 = await prisma.pago.create({
    data: { eventoId: ev5.id, montoTotal: 1200000, tipoPago: 'SALDO_TOTAL', estadoPago: 'PAGADO', fechaEsperada: new Date('2026-11-18T00:00:00Z') },
  });
  await prisma.pagoAbono.create({
    data: { pagoId: pagoEv5.id, monto: 1200000, fechaPago: new Date('2026-11-18T00:00:00Z'), metodoPago: 'TRANSFERENCIA', notas: 'Pago total liquidado' },
  });

  // Asignaciones de personal en eventos
  const asig1 = await prisma.asignacion.create({
    data: { eventoId: ev1.id, operadorId: operadoresCreados.at(0).id, horaInicio: ev1.horaInicio, horaFin: ev1.horaFin },
  });
  await prisma.asignacionFuncion.create({ data: { asignacionId: asig1.id, funcionId: funcionesMap['CAMARA'] } });

  const asig2 = await prisma.asignacion.create({
    data: { eventoId: ev1.id, operadorId: operadoresCreados.at(1).id, horaInicio: ev1.horaInicio, horaFin: ev1.horaFin },
  });
  await prisma.asignacionFuncion.create({ data: { asignacionId: asig2.id, funcionId: funcionesMap['SWITCH'] } });

  // Despacho de kits
  await prisma.eventoKit.create({ data: { eventoId: ev1.id, kitId: kitStreaming.id, cantidad: 1 } });
  await prisma.eventoKit.create({ data: { eventoId: ev2.id, kitId: kitAudio.id, cantidad: 1 } });

  // Auspicios, Gastos, Pérdida y Liquidación
  await prisma.auspicio.createMany({
    data: [
      { eventoId: ev1.id, empresaAuspiciadoraId: auspEntel.id, monto: 500000 },
      { eventoId: ev3.id, empresaAuspiciadoraId: auspBanco.id, monto: 800000 },
    ],
  });

  await prisma.gasto.createMany({
    data: [
      { eventoId: ev1.id, descripcion: 'Alimentación y traslado equipo técnico', monto: 120000, fecha: ev1.fecha },
      { eventoId: ev5.id, descripcion: 'Arriendo generador respaldo', monto: 180000, fecha: ev5.fecha },
    ],
  });

  const perdida1 = await prisma.perdida.create({
    data: {
      eventoId: ev5.id,
      equipoId: equiposCreados.at(5).id,
      descripcion: 'Cabezal fluido de trípode dañado durante desmontaje',
      monto: 65000,
      fecha: ev5.fecha,
    },
  });

  await prisma.distribucionPago.create({
    data: {
      eventoId: ev5.id,
      operadorId: operadoresCreados.at(0).id,
      perdidaId: perdida1.id,
      monto: 135000,
      porcentaje: null,
      fechaDistribucion: ev5.fecha,
      estado: 'LIQUIDADO',
    },
  });

  console.log('Seed masiva ejecutada exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error en la seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
