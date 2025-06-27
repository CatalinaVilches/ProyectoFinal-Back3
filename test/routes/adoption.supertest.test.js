import dotenv from 'dotenv';
dotenv.config();

import chai from "chai";
import supertest from "supertest";
import { describe, it, before, after } from "mocha";
import mongoose from "mongoose";

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

describe('Tests de Adopciones', () => {
    let testUser;
    let testPet;
    let savedUser;
    let savedPet;
    let adoptionRecordId;

    before(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        testUser = {
            first_name: "Marcos",
            last_name: "Varela",
            email: "marcos.varela@test.com",
            password: "clave123"
        };

        testPet = {
            name: "Luna",
            specie: "Conejo",
            birthDate: "2020-01-01",
        };

        const userRes = await requester.post('/api/users').send(testUser);
        savedUser = userRes.body.payload;

        const petRes = await requester.post('/api/pets').send(testPet);
        savedPet = petRes.body.payload;
    });

    it('GET /api/adoptions debe devolver un array de adopciones', async () => {
        const res = await requester.get("/api/adoptions");

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.be.an('array');

        res.body.payload.forEach(adoption => {
            expect(adoption).to.include.all.keys('_id', 'owner', 'pet');
        });
    });

    it('POST /api/adoptions/:uid/:pid debe registrar una adopción correctamente', async () => {
        const res = await requester.post(`/api/adoptions/${savedUser._id}/${savedPet._id}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.include({ status: "success", message: "Pet adopted" });

        adoptionRecordId = res.body.payload._id;
        expect(adoptionRecordId).to.exist;
    });

    it('GET /api/adoptions/:aid debe devolver la adopción por ID', async () => {
        const res = await requester.get(`/api/adoptions/${adoptionRecordId}`);

        expect(res.status).to.equal(200);
        expect(res.body.payload).to.include.all.keys('_id', 'owner', 'pet');
    });

    // Errores esperados

    it('GET /api/adoptions/:aid con ID inexistente debe devolver 404', async () => {
        const fakeId = "c853193b28a2a6201909ba4b";
        const res = await requester.get(`/api/adoptions/${fakeId}`);

        expect(res.statusCode).to.equal(404);
        expect(res.body).to.include({
            status: "error",
            error: "Adoption not found"
        });
    });

    it('POST /api/adoptions/:uid/:pid debe fallar si el usuario no existe', async () => {
        const fakeUserId = "c853193b28a2a6201909ba4b";
        const res = await requester.post(`/api/adoptions/${fakeUserId}/${savedPet._id}`);

        expect(res.body).to.include({
            status: "error",
            error: "user Not found"
        });
    });

    it('POST /api/adoptions/:uid/:pid debe fallar si la mascota no existe', async () => {
        const fakePetId = "983c9925dd86a88a3cf41641";
        const res = await requester.post(`/api/adoptions/${savedUser._id}/${fakePetId}`);

        expect(res.body).to.include({
            status: "error",
            error: "Pet not found"
        });
    });

    after(async function () {
        this.timeout(5000);

        if (savedUser?._id) {
            await requester.delete(`/api/users/${savedUser._id}`);
        }

        if (savedPet?._id) {
            await requester.delete(`/api/pets/${savedPet._id}`);
        }

        if (adoptionRecordId) {
            await mongoose.connection.collection("adoptions").deleteOne({
                _id: new mongoose.Types.ObjectId(adoptionRecordId)
            });
        }

        await mongoose.disconnect();
    });
});
