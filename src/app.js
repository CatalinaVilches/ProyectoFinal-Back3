import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import { logger, middlewareLogger } from './utils/logger.js';
import loggertestRouter from './routes/loggertest.router.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info(`✅DB conectada`))
    .catch(error => console.error(`❌ Error de conexión a MongoDB:`, error));

const swaggerOptions = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "API de Gestión de Usuarios, Mascotas y Adopciones",
            version: "1.0.1",
            description: "Documentación técnica de los endpoints para el sistema de gestión de usuarios, mascotas y adopciones."
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions)
console.log(specs)
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.json());
app.use(cookieParser());
app.use(middlewareLogger);

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use("/loggerTest", loggertestRouter);

app.use((req, res, next) => {
    res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});


app.use(errorHandler);


app.listen(PORT, () => logger.info(`Listening on ${PORT}`))
