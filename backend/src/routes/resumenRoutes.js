import { Router } from 'express';
import { getResumen } from '../controllers/resumenController.js';

const router = Router();
router.get('/', getResumen);

export default router;