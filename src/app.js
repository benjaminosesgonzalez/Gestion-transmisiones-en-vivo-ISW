import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import clienteRoutes from './modules/cliente/cliente.routes.js';
import operadorRoutes from './modules/operador/operador.routes.js'; // ◄ Importación Operador
import eventoRoutes from './modules/evento/evento.routes.js';     // ◄ Importación Evento

const app = express();

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Enrutadores de la API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/operadores', operadorRoutes); // ◄ Ruta Operador
app.use('/api/eventos', eventoRoutes);       // ◄ Ruta Evento

// Captura global de errores
app.use(errorMiddleware);

export default app;
