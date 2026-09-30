import 'dotenv/config'; // Asegura la carga del .env
import { AppDataSource } from '../config/data-source.js';
import bcrypt from 'bcrypt';

async function runSeed() {
  try {
    console.log('Inicializando conexión para el seeding');
    await AppDataSource.initialize();
    console.log('Conexión establecida con éxito.');

    // 1. Población de Funciones de Operadores
    console.log('Inserting Funciones...');
    const funcionRepo = AppDataSource.getRepository('Funcion');
    
    const funcionesData = [
      { nombre: 'CAMARA', descripcion: 'Operador de cámaras de transmisión y registro' },
      { nombre: 'AUDIO', descripcion: 'Ingeniero o técnico de sonido a cargo de mezcla de audio en vivo' },
      { nombre: 'SWITCH', descripcion: 'Director de transmisión / Operador de switch de video (Atem, vMix)' },
      { nombre: 'INSTALACION_TECNICA', descripcion: 'Personal técnico encargado de montaje, cableado y redes' }
    ];

    for (const f of funcionesData) {
      const existe = await funcionRepo.findOneBy({ nombre: f.nombre });
      if (!existe) {
        await funcionRepo.save(funcionRepo.create(f));
      }
    }

    // 2. Población de Tipos de Eventos
    console.log('Inserting Tipos de Evento...');
    const tipoEventoRepo = AppDataSource.getRepository('TipoEvento');
    
    const tiposEventosData = [
      { nombre: 'LICENCIATURA' },
      { nombre: 'PARTIDO' },
      { nombre: 'EVENTO_INFANTIL' },
      { nombre: 'CONGRESO_CORPORATIVO' }
    ];

    for (const te of tiposEventosData) {
      const existe = await tipoEventoRepo.findOneBy({ nombre: te.nombre });
      if (!existe) {
        await tipoEventoRepo.save(tipoEventoRepo.create(te));
      }
    }

    // 3. Población de Tipos de Equipos
    console.log('Inserting Tipos de Equipo...');
    const tipoEquipoRepo = AppDataSource.getRepository('TipoEquipo');
    
    const tiposEquiposData = [
      { nombre: 'CÁMARAS' },
      { nombre: 'AUDIO' },
      { nombre: 'ILUMINACIÓN' },
      { nombre: 'COMPUTACIÓN Y VIDEO' }
    ];

    for (const tq of tiposEquiposData) {
      const existe = await tipoEquipoRepo.findOneBy({ nombre: tq.nombre });
      if (!existe) {
        await tipoEquipoRepo.save(tipoEquipoRepo.create(tq));
      }
    }

    // 4. Población del Usuario Inicial (Rol JEFE para Autenticación de Fase 2)
    console.log('Inserting Usuario Administrador Inicial...');
    const usuarioRepo = AppDataSource.getRepository('Usuario');
    
    const emailAdmin = 'jefe@productora.com';
    const existeAdmin = await usuarioRepo.findOneBy({ email: emailAdmin });

    if (!existeAdmin) {
      // Hasheamos la contraseña por seguridad con 10 rondas de bcrypt
      const hashedPassword = await bcrypt.hash('Admin1234!', 10);
      
      const nuevoJefe = usuarioRepo.create({
        nombre: 'Jefe de Producción',
        email: emailAdmin,
        password: hashedPassword,
        rol: 'JEFE'
      });
      
      await usuarioRepo.save(nuevoJefe);
      console.log(' Usuario administrador ("jefe@productora.com" / "Admin1234!") creado con éxito.');
    } else {
      console.log(' El usuario administrador ya existía.');
    }

    console.log('Seeding completado con éxito.');
  } catch (error) {
    console.error('Error durante la ejecución del seed:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('Conexión cerrada de forma segura.');
  }
}

runSeed();
