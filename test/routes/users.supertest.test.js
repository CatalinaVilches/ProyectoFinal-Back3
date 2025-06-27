import supertest from "supertest";
import { describe, it, before, after } from "mocha";
import chai from 'chai';

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

describe('Test de Usuarios', () => {
    let userMock;
    let createUser;

    before(async () => {
        userMock = {
            first_name: "catalina",
            last_name: "vilches",
            email: `cata.vilches@coderhouse.com`,
            password: "123"
        };

        const res = await requester.post('/api/users').send(userMock);
        createUser = res.body.payload;
    });

    after(async () => {
        if (createUser && createUser._id) {
            await requester.delete(`/api/users/${createUser._id}`);
        }
    });

    it('El endpoint POST /api/users debe crear un usuario', async () => {
        expect(createUser).to.have.property('_id');
    });

    it('El usuario creado debe tener un campo role', () => {
        expect(createUser).to.have.property('role');
    });

    it('El usuario creado debe tener un campo pets que es un arreglo', () => {
        expect(createUser).to.have.property('pets');
        expect(createUser.pets).to.be.an('array');
    });

    it('GET /api/users debe retornar un arreglo con usuarios', async () => {
        const res = await requester.get('/api/users');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('payload');
        expect(res.body.payload).to.be.an('array');
        res.body.payload.forEach(user => {
            expect(user).to.have.property('_id');
            expect(user).to.have.property('email');
        });
    });

    it('GET /api/users/:uid debe encontrar el usuario creado', async () => {
        const res = await requester.get(`/api/users/${createUser._id}`);
        expect(res.status).to.equal(200);
        expect(res.body.payload).to.have.property('first_name', "Eric");
    });

    it('PUT /api/users/:uid debe actualizar el nombre del usuario', async () => {
        expect(createUser.first_name).to.equal("Eric");

        const newName = { first_name: "Fernando" };
        const res = await requester.put(`/api/users/${createUser._id}`).send(newName);

        expect(res.status).to.equal(200);

        const updated = await requester.get(`/api/users/${createUser._id}`);
        expect(updated.body).to.have.property("payload");
        expect(updated.body.payload).to.have.property("first_name", "Fernando");
    });

    it('DELETE /api/users/:uid debe borrar el usuario', async () => {
        const deleteRes = await requester.delete(`/api/users/${createUser._id}`);
        expect(deleteRes.status).to.equal(200);

        const res = await requester.get(`/api/users/${createUser._id}`);
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property("status", "error");
        expect(res.body.message).to.equal("Usuario no encontrado");
    });

    it('GET /api/users/:uid con uid inexistente debe devolver error', async () => {
        const uidInexistente = "683c98b6dd86a18a3cf4163d";
        const res = await requester.get(`/api/users/${uidInexistente}`);
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', "error");
        expect(res.body).to.have.property("message", "Usuario no encontrado");
    });

    it('PUT /api/users/:uid no debe permitir actualizar email si ya existe', async () => {
        const existingEmail = "Federico_Saldana@coderhouse.com";
        const userToUpdateId = createUser ? createUser._id : '683c98b6dd86a18a3cf41633';
        const newEmail = { email: existingEmail };

        const updated = await requester
            .put(`/api/users/${userToUpdateId}`)
            .send(newEmail);

        expect(updated.status).to.equal(400);
        expect(updated.body).to.have.property('error');
        expect(updated.body.error).to.include('El email ya está registrado por otro usuario');
    });
});
