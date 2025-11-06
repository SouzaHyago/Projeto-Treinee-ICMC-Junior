import { Task } from "../models/Task.js";

// faz a chamada ao BD e faz a verificação de erro
async function findAndUpdateTask(id, updates) {
  const updatesTimeStamp = {
    ...updates,
    atualizadoEm: new Date()
  }
  const taskUpdate = await Task.findByIdAndUpdate(id, updatesTimeStamp, { new: true, runValidators: true });

  if (!taskUpdate)
    throw new Error("Tarefa não encontrada");

  return taskUpdate;
}

// Marcar tarefa como concluída
export async function complete(id) {
  return await findAndUpdateTask(id, { status: "CONCLUIDA" });
}

// Editar tarefa
export async function edit(id, updates) {
  return findAndUpdateTask(id, updates);
}

export async function createTaskService(dados,userId){

    const task = await Task.create({
        ...dados,
        userId
    })

    return task;
}