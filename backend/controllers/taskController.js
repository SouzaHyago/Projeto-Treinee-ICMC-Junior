import { Task } from "../models/Task.js";
import {createTaskService} from "../services/taskService.js"

export async function createTask(req, res) {
  try {
    const task = await createTaskService(req.body,req.userId);
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
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

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