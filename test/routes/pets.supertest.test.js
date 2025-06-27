import supertest from "supertest";
import { describe, it, before, after } from "mocha";
import chai from "chai";

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

describe('Adoptme - Pruebas de mascotas', () => {
    let petData;
    let createdPet;

    before(async () => {
        petData = {
            name: "Simba",
            specie: "Canino",
            birthDate: "2020-01-01",
        };

        const response = await requester.post('/api/pets').send(petData);
        createdPet = response.body.payload;
    });

    it('POST /api/pets debe registrar una nueva mascota', () => {
        expect(createdPet).to.have.property('_id');
    });

    it('La mascota registrada debe tener la propiedad adopted en false', () => {
        expect(createdPet).to.have.property('adopted', false);
    });

    it('GET /api/pets debe devolver un objeto con status', async () => {
        const res = await requester.get('/api/pets');
        expect(res.body).to.have.property("status");
    });

    it('GET /api/pets debe devolver un arreglo en la propiedad payload', async () => {
        const res = await requester.get('/api/pets');
        expect(res.body).to.have.property('payload').that.is.an('array');
    });

    it('PUT /api/pets/:pid debe permitir modificar el nombre de la mascota', async () => {
        expect(createdPet.name).to.equal("Simba");

        const updatedData = { name: "Toby" };
        const res = await requester.put(`/api/pets/${createdPet._id}`).send(updatedData);
        expect(res.status).to.equal(200);

        const updated = await requester.get(`/api/pets/${createdPet._id}`);
        expect(updated.body.payload).to.have.property("name", "Toby");
    });

    it('DELETE /api/pets/:pid debe eliminar correctamente la mascota', async () => {
        const res = await requester.delete(`/api/pets/${createdPet._id}`);
        expect(res.status).to.equal(200);

        const check = await requester.get(`/api/pets/${createdPet._id}`);
        expect(check.status).to.equal(404);
        expect(check.body).to.have.property("status", "error");
        expect(check.body.message).to.equal("Mascota no encontrada");
    });

    // Casos negativos

    it('POST /api/pets debe responder 400 si falta el campo name', async () => {
        const petSinNombre = {
            specie: "Felino",
            birthDate: "2021-01-01"
        };

        const res = await requester.post('/api/pets').send(petSinNombre);
        expect(res.status).to.equal(400);
    });

    it('POST /api/pets debe devolver error por datos incompletos', async () => {
        const petInvalido = {
            specie: "Ave",
            birthDate: "2019-05-10",
        };

        const res = await requester.post('/api/pets').send(petInvalido);
        expect(res.body).to.have.property("status", "error");
        expect(res.body).to.have.property("error", "Incomplete values");
    });

    after(async () => {
        if (createdPet && createdPet._id) {
            await requester.delete(`/api/pets/${createdPet._id}`);
        }
    });
});
