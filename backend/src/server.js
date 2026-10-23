import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

import insumosRoutes from './routes/insumosRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import resumenRoutes from './routes/resumenRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Tabla única de rutas: se usa para montarlas y para listarlas al iniciar.
// (No se inspecciona app._router: fue eliminado en Express 5 y provocaba
// "Cannot read properties of undefined (reading 'stack')".)
const apiRoutes = [
  { path: '/api/insumos', router: insumosRoutes, endpoints: ['GET /', 'GET /:id', 'POST /', 'PUT /:id', 'DELETE /:id'] },
  { path: '/api/productos', router: productosRoutes, endpoints: ['GET /', 'GET /:id', 'POST /', 'POST /:id/recetas', 'PUT /:id', 'DELETE /:id'] },
  { path: '/api/pedidos', router: pedidosRoutes, endpoints: ['GET /', 'GET /:id', 'POST /'] },
  { path: '/api/resumen', router: resumenRoutes, endpoints: ['GET /'] },
];

apiRoutes.forEach(({ path, router }) => app.use(path, router));

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ ok: true, timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: error?.message || 'Error de conexión a la base de datos' });
  }
});

// 404 para rutas inexistentes y manejador global de errores (deben ir al final)
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});
app.use(errorHandler);

const logRoutes = () => {
  console.log('\n--- Rutas Registradas ---');
  console.log(`GET     http://localhost:${PORT}/api/health`);
  apiRoutes.forEach(({ path, endpoints }) => {
    endpoints.forEach((endpoint) => {
      const [method, sub] = endpoint.split(' ');
      const subPath = sub === '/' ? '' : sub;
      console.log(`${method.padEnd(7)} http://localhost:${PORT}${path}${subPath}`);
    });
  });
  console.log('-------------------------\n');
};

const server = app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión exitosa a Supabase (PostgreSQL)');
    logRoutes();
  } catch (error) {
    console.error('❌ Error al inicializar servidor:', error?.stack || error);
  }
});

server.on('error', (error) => {
  if (error?.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} ya está en uso. Cierra la otra instancia de "npm run dev" e inténtalo de nuevo.`);
  } else {
    console.error('❌ Error del servidor HTTP:', error?.stack || error);
  }
  process.exit(1);
});

// Un rechazo sin capturar no debe tumbar el proceso ni ocultar su causa.
// `reason` puede ser undefined o un objeto sin .stack (p. ej. { status, message }).
process.on('unhandledRejection', (reason) => {
  console.error('❌ Promesa rechazada sin capturar:', reason?.stack || reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error?.stack || error);
  process.exit(1);
});