import createMockPet from "../mock/mockingPets.js";
import createMockUser from "../mock/mockingUser.js";
import generateMockData from "../services/mocks.services.js";
import { logger } from "../utils/logger.js";

const mockPet = async (req, res) => {
  try {
    const pets = createMockPet(100);
    res.json({ status: "success", payload: pets });
  } catch (error) {
    logger.error(`Error en mockPet: ${error.message}`);
    res.status(500).json({ status: "error", error: "Error al generar mascotas mock" });
  }
};

const mockUser = async (req, res) => {
  try {
    const users = createMockUser(50);
    res.json({ status: "success", payload: users });
  } catch (error) {
    logger.error(`Error en mockUser: ${error.message}`);
    res.status(500).json({ status: "error", error: "Error al generar usuarios mock" });
  }
};

const generateData = async (req, res) => {
  try {
    const { users, pets } = req.params;

    // Validar que users y pets sean números
    const usersCount = Number(users);
    const petsCount = Number(pets);
    if (isNaN(usersCount) || isNaN(petsCount)) {
      return res.status(400).json({ status: "error", error: "Parámetros inválidos, deben ser números" });
    }

    const result = await generateMockData(usersCount, petsCount);
    return res.json({ status: "success", message: "Datos generados correctamente", ...result });
  } catch (error) {
    logger.error(`Error al generar datos: ${error.name} - ${error.message}`);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export default {
  mockPet,
  mockUser,
  generateData,
};
