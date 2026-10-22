import * as Pedido from '../models/pedidoModel.js';

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAllOrders();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findOrderById(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPedido = async (req, res) => {
  try {
    const nuevoPedido = await Pedido.createOrderWithTransaction(req.body);
    res.status(201).json(nuevoPedido);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Error al procesar el pedido' });
  }
};