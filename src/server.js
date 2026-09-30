import 'dotenv/config';
import app from './app.js';
import { AppDataSource } from './config/data-source.js';
import { env } from './config/env.js';

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión a la base de datos establecida');

    app.listen(env.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  });