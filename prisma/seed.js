import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function runSeed() {
  try {
    console.log('Iniciando proceso de seeding con Prisma...');

    // 1. Población de Funciones de Operadores
    console.log('Insertando Funciones...');
    const funcionesData = [
      { nombre: 'CAMARA', descripcion: 'Operador de cámaras de transmisión y registro' },
      { nombre: 'AUDIO', descripcion: 'Ingeniero o técnico de sonido a cargo de mezcla de audio en vivo' },
      { nombre: 'SWITCH', descripcion: 'Director de transmisión / Operador de switch de video (Atem, vMix)' },
      { nombre: 'INSTALACION_TECNICA', descripcion: 'Personal técnico encargado de montaje, cableado y redes' },
    ];

    for (const f of funcionesData) {
      await prisma.funcion.upsert({
        where: { nombre: f.nombre },
        update: {},
        create: f,
      });
    }

    // 2. Población de Tipos de Equipos
    console.log('Insertando Tipos de Equipo...');
    const tiposEquiposData = [
      { nombre: 'CÁMARAS' },
      { nombre: 'AUDIO' },
      { nombre: 'ILUMINACIÓN' },
      { nombre: 'COMPUTACIÓN Y VIDEO' },
    ];

    for (const tq of tiposEquiposData) {
      await prisma.tipoEquipo.upsert({
        where: { nombre: tq.nombre },
        update: {},
        create: tq,
      });
    }

    // 3. Población del Usuario Inicial (Rol JEFE)
    console.log('Insertando Usuario Administrador Inicial...');
    const emailAdmin = 'jefe@productora.com';
    const hashedPassword = await bcrypt.hash('Admin1234!', 10);

    await prisma.usuario.upsert({
      where: { email: emailAdmin },
      update: {},
      create: {
        nombre: 'Jefe de Producción',
        email: emailAdmin,
        password: hashedPassword,
        rol: 'JEFE',
      },
    });

    console.log('Usuario administrador ("jefe@productora.com" / "Admin1234!") verificado.');
    console.log('Seeding completado con éxito.');
  } catch (error) {
    console.error('Error durante la ejecución del seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Conexión cerrada de forma segura.');
  }
}

runSeed();
