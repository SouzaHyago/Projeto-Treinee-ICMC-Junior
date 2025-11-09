import { Task } from "../models/Task.js";

// faz a chamada ao BD e faz a verificação de erro
export async function findAndUpdateTask(id, updates, userId) {
  const updatesTimeStamp = {
    ...updates,
    atualizadoEm: new Date()
  };

  console.log(updatesTimeStamp);
    console.log(id);
    console.log(userId);

  const taskUpdate = await Task.findOneAndUpdate(
    { _id: id, userId: userId },
    updatesTimeStamp,
    { new: true, runValidators: true }
  );

  if (!taskUpdate)
    throw new Error("Tarefa não encontrada ou não pertence a este usuário");

  return taskUpdate;
}


// Marcar tarefa como concluída
export async function complete(id, userId) {
  return await findAndUpdateTask(id, { status: "CONCLUIDA" }, userId);
}



export async function create(dados,userId){

    const task = await Task.create({
        ...dados,
        userId
    })

    return task;
}


export async function list(userId) {
  const tasks = await Task.find({ userId }).sort({ prazo: 1 });
  return tasks;
}
