import __dirname from './index.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración del almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const targetFolder = isImage ? 'pets' : 'documents';

    const uploadPath = path.join(__dirname, '..', 'public', targetFolder);

    // Asegurarse de que la carpeta exista
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Nombre del archivo con timestamp para evitar colisiones
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/\s+/g, '_'); // Evita espacios en el nombre del archivo
    cb(null, `${timestamp}-${cleanName}`);
  }
});

// Middleware Multer configurado
const uploader = multer({ storage });

export default uploader;
