import 'dotenv/config';
import app from './app.js';
import { prisma } from './config/prisma.js';
import { env } from './config/env.js';

try {
  // Verificamos la conexión con la base de datos al arrancar
  await prisma.$connect();
  console.log('Conexión a la base de datos establecida');

  app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
  });
} catch (error) {
  console.error('Error al conectar a la base de datos:', error.message);
  process.exit(1);
}

// Desconexión limpia de Prisma si el proceso de Node se interrumpe (Ctrl+C o PM2)
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
