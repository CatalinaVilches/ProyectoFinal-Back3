import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";

const JWT_SECRET = "tokenSecretJWT"; // Ideal: poner esto en variables de entorno

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: "error", error: "Valores incompletos" });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      return res.status(400).json({ status: "error", error: "El usuario ya existe" });
    }

    const hashedPassword = await createHash(password);
    const userData = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };

    const result = await usersService.create(userData);
    res.status(201).json({ status: "success", payload: result._id });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "error", error: "Valores incompletos" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      return res.status(400).json({ status: "error", error: "Contraseña incorrecta" });
    }

    user.last_connection = new Date();
    await user.save();

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("coderCookie", token, { maxAge: 3600000, httpOnly: true }).json({
      status: "success",
      message: "Usuario autenticado",
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const current = (req, res) => {
  try {
    const token = req.cookies["coderCookie"];
    if (!token) return res.status(401).json({ status: "error", error: "No autorizado" });

    const user = jwt.verify(token, JWT_SECRET);
    res.json({ status: "success", payload: user });
  } catch (error) {
    res.status(401).json({ status: "error", error: "Token inválido o expirado" });
  }
};

const unprotectedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "error", error: "Valores incompletos" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      return res.status(400).json({ status: "error", error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(user.toObject(), JWT_SECRET, { expiresIn: "1h" });

    res.cookie("unprotectedCookie", token, { maxAge: 3600000, httpOnly: true }).json({
      status: "success",
      message: "Unprotected logged in",
    });
  } catch (error) {
    console.error("Error en unprotectedLogin:", error);
    res.status(500).json({ status: "error", error: "Error en el servidor" });
  }
};

const unprotectedCurrent = (req, res) => {
  try {
    const token = req.cookies["unprotectedCookie"];
    if (!token) return res.status(401).json({ status: "error", error: "No autorizado" });

    const user = jwt.verify(token, JWT_SECRET);
    res.json({ status: "success", payload: user });
  } catch (error) {
    res.status(401).json({ status: "error", error: "Token inválido o expirado" });
  }
};

export default {
  register,
  login,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
