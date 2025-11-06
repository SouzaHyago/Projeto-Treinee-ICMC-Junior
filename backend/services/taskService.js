import { Task } from "../models/Task.js";


export async function createTaskService(dados,userId){

    const task = await Task.create({
        ...dados,
        userId
    })

    return task;
}