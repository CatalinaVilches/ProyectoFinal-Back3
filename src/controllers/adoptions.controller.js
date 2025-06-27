import { adoptionsService, petsService, usersService } from "../services/index.js";

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionsService.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Error fetching adoptions" });
  }
};

const getAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption)
      return res.status(404).send({ status: "error", error: "Adoption not found" });
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Error fetching adoption" });
  }
};

const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;

    const user = await usersService.getUserById(uid);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    const pet = await petsService.getBy({ _id: pid });
    if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });

    if (pet.adopted)
      return res.status(400).send({ status: "error", error: "Pet is already adopted" });

    // Actualizar relación usuario-mascota
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });

    // Marcar mascota como adoptada y asignar dueño
    await petsService.update(pet._id, { adopted: true, owner: user._id });

    // Crear registro de adopción
    const createdAdoption = await adoptionsService.create({ owner: user._id, pet: pet._id });

    res.status(201).send({
      status: "success",
      payload: { _id: createdAdoption._id },
      message: "Pet adopted",
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: "Error processing adoption" });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
