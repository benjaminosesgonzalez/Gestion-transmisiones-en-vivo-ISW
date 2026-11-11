import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import clienteRoutes from './modules/cliente/cliente.routes.js';
import operadorRoutes from './modules/operador/operador.routes.js'; // ◄ Importación Operador
import eventoRoutes from './modules/evento/evento.routes.js';     // ◄ Importación Evento
import funcionRoutes from './modules/funcion/funcion.routes.js';
import tipoEquipoRoutes from './modules/tipoEquipo/tipoEquipo.routes.js';
import equipoRoutes from './modules/equipo/equipo.routes.js';
import kitRoutes from './modules/kit/kit.routes.js';
import gastoRoutes from './modules/gasto/gasto.routes.js';
import asignacionRoutes from './modules/asignacion/asignacion.routes.js';
import despachoRoutes from './modules/despacho/despacho.routes.js';
import liquidacionRoutes from './modules/liquidacion/liquidacion.routes.js';
import pagoRoutes from './modules/pago/pago.routes.js';
import auspiciadorRoutes from './modules/auspiciador/auspiciador.routes.js';

const app = express();

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Permite visualizar los PDF/imágenes subidos desde el navegador
app.use('/uploads', express.static('uploads'));

// Enrutadores de la API
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/despachos', despachoRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/eventos', eventoRoutes);   
app.use('/api/funciones', funcionRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/operadores', operadorRoutes); 
app.use('/api/pagos', pagoRoutes);
app.use('/api/tipos-equipo', tipoEquipoRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/asignaciones', asignacionRoutes);
app.use('/api/liquidaciones', liquidacionRoutes);
app.use('/api/auspiciadores', auspiciadorRoutes);

// Captura global de errores
app.use(errorMiddleware);

export default app;
