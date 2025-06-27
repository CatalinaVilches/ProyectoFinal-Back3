import winston from 'winston';

// Definición de niveles personalizados de log
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'bold red',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'cyan'
  }
};

// Entorno actual: 'development' por defecto
const ENV = process.env.NODE_ENV || 'development';

winston.addColors(customLevels.colors);

// Configuración de salidas (transports)
const transportList = [
  new winston.transports.Console({
    level: ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    )
  })
];

// En producción se guarda log de errores en archivo
if (ENV === 'production') {
  transportList.push(
    new winston.transports.File({
      filename: './src/logs/errors.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  );
}

// Exportación del logger personalizado
export const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: transportList
});

// Middleware que inyecta el logger en cada request
export const middlewareLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
