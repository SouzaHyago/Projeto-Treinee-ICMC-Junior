import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  dataNascimento: { type: Date, default: Date.now  },
  ativo: {type: Boolean, default: true},
  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
