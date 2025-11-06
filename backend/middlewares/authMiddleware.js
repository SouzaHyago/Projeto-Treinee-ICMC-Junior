import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId);

    if (!user.ativo) return res.status(403).json({ error: "Usuário inativo" });

    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}
