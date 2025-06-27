import petModel from "../dao/models/Pet.js";
import userModel from "../dao/models/User.js";
import createMockPet from "../mock/mockingPets.js";
import createMockUser from "../mock/mockingUser.js";

const generateMockData = async (users, pets) => {
    if (
        (typeof users !== "number" || users < 0) &&
        (typeof pets !== "number" || pets < 0)
    ) {
        throw new Error("Se debe enviar al menos 'users' o 'pets' en formato numérico positivo.");
    }

    const mockUsers = typeof users === "number" && users > 0 ? createMockUser(users) : [];
    const mockPets = typeof pets === "number" && pets > 0 ? createMockPet(pets) : [];

    if (mockUsers.length > 0) {
        await userModel.insertMany(mockUsers);
    }

    if (mockPets.length > 0) {
        await petModel.insertMany(mockPets);
    }

    return {
        usersCreated: mockUsers,
        petsCreated: mockPets
    };
};

export default generateMockData;
