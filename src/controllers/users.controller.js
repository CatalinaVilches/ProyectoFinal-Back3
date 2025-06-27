import userModel from '../dao/models/User.js';
import { usersService } from '../services/index.js';

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching users' });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.uid;
  try {
    const user = await usersService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    res.json({ status: 'success', payload: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error retrieving user' });
  }
};

const createUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ status: 'error', error: 'Faltan datos obligatorios' });
  }

  try {
    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ status: 'error', message: 'El usuario ya existe' });
    }

    const newUser = await usersService.create({ first_name, last_name, email, password });

    res.status(201).json({ status: 'success', payload: newUser, message: 'Registro completado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creando usuario' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.uid;
  const updateData = req.body;

  try {
    const userExists = await usersService.getUserById(userId);
    if (!userExists) {
      return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
    }

    const updatedUser = await usersService.update(userId, updateData);

    res.json({ status: 'success', message: 'Usuario actualizado correctamente', user: updatedUser });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        status: 'error',
        error: 'El email ya está registrado por otro usuario',
      });
    }
    res.status(500).json({ status: 'error', message: 'Error actualizando usuario' });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;

  try {
    await usersService.delete(userId);
    res.json({ status: 'success', message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error eliminando usuario' });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No se subieron archivos.' });
    }

    const documents = files.map((file) => ({
      name: file.originalname,
      reference: file.path,
    }));

    const user = await userModel.findByIdAndUpdate(
      uid,
      { $push: { documents: { $each: documents } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Documentos subidos y usuario actualizado correctamente.',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al subir documentos' });
  }
};

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadDocuments,
};
