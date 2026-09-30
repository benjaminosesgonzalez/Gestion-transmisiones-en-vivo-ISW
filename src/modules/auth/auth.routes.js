import { Router } from 'express';
import { authController } from './auth.controller.js';

const router = Router();

// Endpoint público de Login
router.post('/login', authController.login);

export default router;
