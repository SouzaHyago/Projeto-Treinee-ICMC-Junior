import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createTask
  listTasks,
  updateTask,
  deleteTask,
  completeTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", listTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/complete/:id", completeTask);

export default router;
