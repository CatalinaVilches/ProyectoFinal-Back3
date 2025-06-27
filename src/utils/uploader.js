import __dirname from './index.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const targetFolder = isImage ? 'pets' : 'documents';

    const uploadPath = path.join(__dirname, '..', 'public', targetFolder);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/\s+/g, '_'); 
    cb(null, `${timestamp}-${cleanName}`);
  }
});

const uploader = multer({ storage });

export default uploader;
