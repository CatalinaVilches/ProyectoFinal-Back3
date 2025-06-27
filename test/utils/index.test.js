import { createHash } from "../../src/utils/index.js";
import bcrypt from 'bcrypt';
import Assert from 'assert';
import { describe, it } from "mocha";

const assert = Assert.strict;

describe("Test función de hash", () => {

    it("Si mando una contraseña en texto plano, retorna un valor codificado", async () => {
        const password = "123";
        const resultado = await createHash(password);
        assert.notDeepEqual(password, resultado);
        assert.ok(resultado.startsWith("$2b$"), "El hash debe comenzar con $2b$");
        assert.equal(resultado.length, 60);
    });

    it("Debería validar correctamente una contraseña hasheada", async () => {
        const password = "123456";
        const hashed = await bcrypt.hash(password, 10);

        const esValido = await bcrypt.compare(password, hashed);

        assert.strictEqual(esValido, true, "La contraseña debería coincidir con el hash");
    });

    it("No debería validar una contraseña incorrecta", async () => {
        const hashed = await bcrypt.hash("123456", 10);

        const esValido = await bcrypt.compare("contraseñaErrónea", hashed);

        assert.strictEqual(esValido, false, "La contraseña no debería coincidir");
    });
});
