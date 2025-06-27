import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

// Endpoints de autenticación
router.post('/register', sessionsController.register);
router.post('/login', sessionsController.login);

// Endpoints protegidos y no protegidos
router.get('/current', sessionsController.current);
router.get('/unprotectedLogin', sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent', sessionsController.unprotectedCurrent);

export default router;
