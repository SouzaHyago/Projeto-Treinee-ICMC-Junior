import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function registerUser(dados) {

  const { nome, email, cpf, dataNascimento, senha } = dados;

  const existing = await User.findOne({ $or: [{ email }, { cpf }] });
  if (existing) throw new Error("Usuário já cadastrado");

  const senhaHash = await bcrypt.hash(senha, 10);

  const user = await User.create({
    nome,
    email,
    cpf,
    dataNascimento,
    senhaHash,
  });

  return user;
}

export async function loginUser({ email, senha }) {

  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuário não encontrado");

  const valid = await bcrypt.compare(senha, user.senhaHash);
  if (!valid) throw new Error("Senha incorreta");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token };
}
