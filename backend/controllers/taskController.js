import { Task } from "../models/Task.js";
import { complete, create, findAndUpdateTask  } from "../services/taskService.js";

export async function completeTask(req, res) {
  try {
    const task = await complete(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function createTask(req, res) {
  try {
    const task = await create(req.body,req.userId);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listTasks(req, res) {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao listar tarefas", details: err.message });
  }
}

export async function deleteTask(req, res) {
  try {
    //const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.status(200).json({ message: "Tarefa excluída com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao excluir tarefa", details: err.message });
  }
}

export async function updateTask(req, res) {
  try {
    const task = await findAndUpdateTask(req.params.id, req.body, req.userId);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefa", details: err.message });
  }
}
