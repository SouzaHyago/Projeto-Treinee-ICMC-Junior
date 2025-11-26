import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	titulo: {type: String, required: true},
	descricao: {type: String},
	prazo: {type: Date, required: true},
	obs: { type: String },
	status: {
		type: String,
		enum: ["PENDENTE","ATRASADA","CONCLUIDA","EM ANDAMENTO"],
		default: "PENDENTE"
	}
  },
  { timestamps: true }
)

export const Task = mongoose.model("Task",taskSchema)