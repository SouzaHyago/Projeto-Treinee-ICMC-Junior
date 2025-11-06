import mongoose from "mongoose";
import "dotenv/config"

export async function conectarDB() {
  try {
    await mongoose.connect(process.env.DATABSE_URI);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar no MongoDB:", err);
  }
}
