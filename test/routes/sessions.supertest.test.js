import supertest from 'supertest';
import chai from 'chai';
import { describe, it, after } from 'mocha';

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

describe('Test avanzado', () => {
    let cookie;
    let createUserId;

    it('/api/sessions/register Debe registrar correctamente a un usuario', async function () {
        const mockUser = {
            first_name: "Catalina",
            last_name: "vilches",
            email: "cata.vilches@coderhouse.com", // email original
            password: "Pass"               // contraseña más segura
        };

        const res = await requester.post('/api/sessions/register').send(mockUser);
        expect(res.status).to.equal(200);
        createUserId = res.body.payload;
        expect(createUserId).to.be.ok;
    });

    it('/api/sessions/login Debe loguear correctamente al usuario y devolver una COOKIE', async function () {
        const mockUser = {
            email: 'cata.vilches@coderhouse.com',
            password: 'Pass'  // misma contraseña que el registro
        };

        const result = await requester.post('/api/sessions/login').send(mockUser);
        expect(result.status).to.equal(200);

        const cookieResult = result.headers['set-cookie']?.[0];
        expect(cookieResult).to.be.ok;

        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1].split(';')[0]
        };

        expect(cookie.name).to.equal('coderCookie');
        expect(cookie.value).to.be.ok;
    });

    it('Debe enviar la cookie que contiene el usuario y destructurar este correctamente', async function () {
        const res = await requester
            .get('/api/sessions/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('payload');
        expect(res.body.payload).to.have.property('email', 'cata.vilches@coderhouse.com');
    });

    // Pruebas que deben devolver error

    it('POST /api/users debe responder con 400 si no se envía first_name', async () => {
        const incompleteUser = {
            last_name: "vilches",
            email: "cata.vilches@coderhouse.com",
            password: "Pass"
        };

        const res = await requester.post('/api/users').send(incompleteUser);
        expect(res.status).to.equal(400);
    });

    it('POST /api/users debe responder con status:error e "Incomplete values" si falta first_name', async () => {
        const incompleteUser = {
            last_name: "vilches",
            email: "cata.vilches@coderhouse.com",
            password: "Pass"
        };

        const res = await requester.post('/api/users').send(incompleteUser);
        expect(res.body).to.have.property("status", "error");
        expect(res.body).to.have.property("error", "Incomplete values");
    });

    it('POST /api/sessions/login debe devolver error al ingresar contraseña incorrecta', async function () {
        const mockUser = {
            email: 'cata.vilches@coderhouse.com',
            password: 'incorrect'
        };
        const result = await requester.post('/api/sessions/login').send(mockUser);

        expect(result.status).to.equal(400);
        expect(result.body).to.have.property("status", "error");
        expect(result.body).to.have.property("error", "Incorrect password");
    });

    after(async () => {
        try {
            if (createUserId) {
                await requester.delete(`/api/users/${createUserId}`);
            }
        } catch (err) {
            console.error('❌ Error al eliminar el usuario en after:', err.message);
        }
    });
});
