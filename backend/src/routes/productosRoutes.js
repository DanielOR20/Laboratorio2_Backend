import { Router } from 'express';
import {
  getProductos,
  getProducto,
  createProducto,
  linkReceta,
  updateProducto,
  deleteProducto
} from '../controllers/productosController.js';

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProducto);
router.post('/', createProducto);
router.post('/:id/recetas', linkReceta);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;