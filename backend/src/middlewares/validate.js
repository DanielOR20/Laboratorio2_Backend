export const validatePedidoBody = (req, res, next) => {
  const { metodo_pago, items } = req.body;
  const metodosValidos = ['efectivo', 'tarjeta', 'sinpe_movil'];

  if (!metodo_pago || !metodosValidos.includes(metodo_pago)) {
    return res.status(400).json({
      error: 'metodo_pago inválido. Métodos admitidos: efectivo, tarjeta, sinpe_movil'
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'El campo items debe ser un arreglo con al menos un producto'
    });
  }

  for (const item of items) {
    if (!item.producto_id || !item.cantidad || Number(item.cantidad) <= 0) {
      return res.status(400).json({
        error: 'Cada item debe contener un producto_id y una cantidad entera mayor a 0'
      });
    }
  }

  next();
};