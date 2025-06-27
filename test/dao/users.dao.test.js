import Users from "../../src/dao/Users.dao.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { describe, it, before, after } from "mocha";
import Assert from "assert";
import { logger } from "../../src/utils/logger.js";

dotenv.config();
const assert = Assert.strict;
const usersDao = new Users();

describe("Pruebas de conexión y capa DAO - Users", function () {
    before(async function () {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            logger.info("✅ Conexión exitosa a MongoDB");
        } catch (error) {
            logger.error("❌ Error al conectar a MongoDB:", error);
            throw error;
        }
    });

    it("Debe obtener usuarios desde la base de datos", async function () {
        const resultado = await usersDao.get();
        assert.ok(Array.isArray(resultado), "El resultado debe ser un arreglo");
        assert.ok(resultado.length > 0, "Se esperaban usuarios en la base de datos");
    });

    after(async function () {
        await mongoose.disconnect();
        logger.info("🔌 Conexión cerrada tras las pruebas");
    });
});
