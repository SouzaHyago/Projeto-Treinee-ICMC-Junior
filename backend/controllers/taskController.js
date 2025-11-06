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