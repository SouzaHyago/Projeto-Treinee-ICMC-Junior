import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import validarCPF from "../utils/cpfValidator.js";

export async function registerUser(dados) {
  const { nome, email, cpf, dataNascimento, senha } = dados;

  const cpfLimpo = cpf.replace(/\D/g, "");

  if (!validarCPF(cpfLimpo)) throw new Error("CPF inválido");

  const existing = await User.findOne({
    $or: [{ email }, { cpf: cpfLimpo }]
  });
  if (existing) throw new Error("Usuário já cadastrado");

  const senhaHash = await bcrypt.hash(senha, 10);

  const user = await User.create({
    nome,
    email,
    cpf: cpfLimpo,
    dataNascimento,
    senhaHash,
  });

  const userSemSenha = user.toObject();
  delete userSemSenha.senhaHash;

  return userSemSenha;
}


export async function loginUser(dados) {
  const { emailCpf, senha, activate } = dados;

  const user = await User.findOne({
    $or: [{ email: emailCpf }, { cpf: emailCpf }]
  }).select("+senhaHash");  

  if (!user) throw new Error("Usuário não encontrado");

  if ((!user.ativo) && (!activate)) throw new Error("Conta desativada");

  const valid = await bcrypt.compare(senha, user.senhaHash);
  if (!valid) throw new Error("Senha incorreta");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token };
}



export async function updateUser(updates,userId) {
  const allowedFields = ["nome", "dataNascimento", "cpf", "email", "senha"];

  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  if (filteredUpdates.senha) {
    filteredUpdates.senhaHash = await bcrypt.hash(filteredUpdates.senha, 10);
    delete filteredUpdates.senha;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true, runValidators: true }
  ).select("-senhaHash"); 

  return user;
}

export async function softDeleteUser(userId) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      ativo: false,
      deletedAt: new Date()
    },
    { new: true }
  ).select("-senhaHash");

  return user;
}

