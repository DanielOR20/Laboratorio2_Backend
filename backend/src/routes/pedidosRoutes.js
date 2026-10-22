import { Router } from 'express';
import { getPedidos, getPedido, createPedido } from '../controllers/pedidosController.js';
import { validatePedidoBody } from '../middlewares/validate.js';

const router = Router();

router.get('/', getPedidos);
router.get('/:id', getPedido);
router.post('/', validatePedidoBody, createPedido);

export default router;