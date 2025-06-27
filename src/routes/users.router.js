import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { usersService } from '../services/index.js';
import uploader from '../utils/uploader.js';

const router = Router();

// Rutas de usuarios
router.get('/', usersController.getAllUsers);
router.post('/', usersController.createUser);
router.get('/:uid', usersController.getUser);
router.put('/:uid', usersController.updateUser);
router.delete('/:uid', usersController.deleteUser);

// Subida de documentos de usuario
router.post(
  '/:uid/documents',
  uploader.array('documents'),
  usersController.uploadDocuments
);

export default router;
