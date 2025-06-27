import { fakerES_MX as fa } from "@faker-js/faker";

function createMockPet(count = 1) {
    const pets = [];

    for (let i = 0; i < count; i++) {
        pets.push({
            name: fa.animal.dog(),
            specie: fa.animal.type(),
            birthDate: fa.date.past({ years: 15 }).toISOString().split("T")[0], 
            adopted: false,
            owner: null, 
        });
    }

    return pets;
}

export default createMockPet;
