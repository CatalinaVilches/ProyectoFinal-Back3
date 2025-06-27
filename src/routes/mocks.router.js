import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

router.get('/mockingpets', mocksController.mockPet);
router.get('/mockingusers', mocksController.mockUser);

router.post('/generateData', mocksController.generateData);

export default router;
