import mongoose from "mongoose"

const taskScheema = new mongoose.Scheema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	titulo: {type: String, required: true},
	descricao: {type: String},
	prazo: {type: Date, required: true},
	status: {
		type: String,
		enum: ["PENDENTE","ATRASADA","CONCLUIDA","EM ANDAMENTO"],
		default: ["PENDENTE"]
	},
	criadoEm: {type: Date, default: Date.now},
	atualizadoEm: {type: Date, default: Date.now}
})

export const Task = mongoose.model("Task",taskScheema)