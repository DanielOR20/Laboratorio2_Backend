import { Router } from 'express';
import {
  getInsumos,
  getInsumo,
  createInsumo,
  updateInsumo,
  deleteInsumo
} from '../controllers/insumosController.js';

const router = Router();

router.get('/', getInsumos);
router.get('/:id', getInsumo);
router.post('/', createInsumo);
router.put('/:id', updateInsumo);
router.delete('/:id', deleteInsumo);

export default router;