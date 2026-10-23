export const errorHandler = (err, req, res, next) => {
  // `err` puede ser undefined/null o un objeto plano ({ status, message }) sin .stack
  console.error('Error capturado por middleware:', err?.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  if (err?.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Errores de restricciones de PostgreSQL
  if (err?.code === '23503') {
    return res.status(409).json({ error: 'Conflicto de clave foránea en la base de datos' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};