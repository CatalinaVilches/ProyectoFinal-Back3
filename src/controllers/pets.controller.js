import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    res.json({ status: "success", payload: pets });
  } catch (error) {
    console.error("Error en getAllPets:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const getPid = async (req, res) => {
  try {
    const pet = await petsService.getBy({ _id: req.params.pid });
    if (!pet) {
      return res.status(404).json({ status: "error", message: "Mascota no encontrada" });
    }
    res.json({ status: "success", payload: pet });
  } catch (error) {
    console.error("Error en getPid:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      return res.status(400).json({ status: "error", error: "Valores incompletos" });
    }

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    res.status(201).json({ status: "success", payload: result });
  } catch (error) {
    console.error("Error en createPet:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const updatePet = async (req, res) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    const result = await petsService.update(petId, petUpdateBody);
    if (!result) {
      return res.status(404).json({ status: "error", message: "Mascota no encontrada" });
    }

    res.json({ status: "success", message: "Mascota actualizada" });
  } catch (error) {
    console.error("Error en updatePet:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);

    if (!result) {
      return res.status(404).json({ status: "error", message: "Mascota no encontrada" });
    }

    res.json({ status: "success", message: "Mascota eliminada" });
  } catch (error) {
    console.error("Error en deletePet:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const createPetWithImage = async (req, res) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate) {
      return res.status(400).json({ status: "error", error: "Valores incompletos" });
    }

    if (!file) {
      return res.status(400).json({ status: "error", error: "Imagen requerida" });
    }

    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });

    const result = await petsService.create(pet);
    res.status(201).json({ status: "success", payload: result });
  } catch (error) {
    console.error("Error en createPetWithImage:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

export default {
  getAllPets,
  getPid,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
