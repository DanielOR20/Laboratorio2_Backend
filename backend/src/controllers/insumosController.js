import * as insumosService from '../services/insumosService.js';

export const getInsumos = async (req, res) => {
  try {
    const insumos = await insumosService.getAllInsumos();
    res.status(200).json(insumos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await insumosService.getInsumoById(id);
    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.status(200).json(insumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInsumo = async (req, res) => {
  try {
    const { nombre, unidad, stock, stock_minimo } = req.body;
    if (!nombre || !unidad || stock === undefined || stock_minimo === undefined) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios (nombre, unidad, stock, stock_minimo)' });
    }
    const nuevoInsumo = await insumosService.createInsumo({ nombre, unidad, stock, stock_minimo });
    res.status(201).json(nuevoInsumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, unidad, stock, stock_minimo } = req.body;
    const insumoExistente = await insumosService.getInsumoById(id);
    if (!insumoExistente) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    const actualizado = await insumosService.updateInsumo(id, { nombre, unidad, stock, stock_minimo });
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await insumosService.deleteInsumo(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.status(200).json({ mensaje: 'Insumo eliminado con éxito' });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({ error: 'No se puede eliminar: el insumo está asignado a una receta activa' });
    }
    res.status(500).json({ error: error.message });
  }
};