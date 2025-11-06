import { registerUser, loginUser, updateUser, softDeleteUser } from "../services/userService.js";
import { User } from "../models/User.js";

export async function register(req, res) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.userId).select("-senhaHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
}

export async function updateProfile(req, res) {
  try {
    const user = await updateUser(req.body,req.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProfile(req, res) {
  try {
    const user = await softDeleteUser(req.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}