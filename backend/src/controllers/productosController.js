import * as Producto from '../models/productoModel.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByIdWithReceta(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { nombre, precio, categoria } = req.body;
    if (!nombre || precio === undefined || !categoria) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, precio, categoria' });
    }
    if (Number(precio) <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    }

    const nuevoProducto = await Producto.create({ nombre, precio, categoria });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const linkReceta = async (req, res) => {
  try {
    const { id } = req.params;
    const { insumo_id, cantidad } = req.body;

    if (!insumo_id || cantidad === undefined || Number(cantidad) <= 0) {
      return res.status(400).json({ error: 'insumo_id y cantidad (> 0) son obligatorios' });
    }

    const itemReceta = await Producto.addInsumoToReceta(id, { insumo_id, cantidad });
    res.status(201).json(itemReceta);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(404).json({ error: 'El producto o el insumo especificado no existe' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria, activo } = req.body;

    const productoActualizado = await Producto.update(id, { nombre, precio, categoria, activo });
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Producto.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};