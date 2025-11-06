import { Task } from "../models/Task.js";
import { complete } from "../services/taskService.js";

export async function completeTask(req, res) {
  try {
    const task = await complete(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}