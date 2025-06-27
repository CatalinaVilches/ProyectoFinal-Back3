import fs from 'fs';
import path from 'path';

const logsDirectory = path.resolve('./src/logs');
const errorLogPath = path.join(logsDirectory, 'error.log');

export const errorHandler = (err, req, res, next) => {
  const timeStamp = new Date().toISOString();
  const logMessage = `[${timeStamp}] ${err.name}: ${err.message}\n${err.stack}\n\n`;

  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
  }

  fs.appendFileSync(errorLogPath, logMessage);

  res.status(err.statusCode || 500).json({
    ok: false,
    mensaje: 'Ha ocurrido un error inesperado en el servidor',
  });
};
