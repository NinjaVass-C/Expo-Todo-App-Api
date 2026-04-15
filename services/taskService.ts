import {taskRepo} from '../db/repos/tasksRepo.ts'
import {requireAuth} from "../utils/auth.ts";
import {ErrorResponse} from "../utils/errorResponse.ts";
import {validateSingleTask, validateTaskBody} from "../utils/validateRequests.ts";

export async function getAllTasks(req: Request) {
    try {
        const user = await requireAuth(req)
        const userId = user.userId
        const tasks = await taskRepo.getAll(userId)
        return Response.json({data: tasks}, {status: 200})
    } catch (error: any) {
        return ErrorResponse(error.message || "Server error", error.status || 500)
    }
}

export async function getTaskById(id: number, req: Request) {
    if (id <= 0) return ErrorResponse("Invalid id", 400)
    try {
        const user = await requireAuth(req)
        const userId = user.userId
        const task = await taskRepo.getOne(id, userId)
        if (!task) {
            return ErrorResponse("Task not found", 404)
        }
        return Response.json({ data: task }, { status: 200 });
    } catch (error: any) {
        return ErrorResponse(error.message || "Server error", error.status || 500)
    }
}

export async function createTask(req: Request) {
    let body: any;
    try {
        body = await req.json();
    } catch {
        body = null;
    }
    if (!body) return ErrorResponse("Invalid json body", 400)
    const errors = validateTaskBody(body)
    if (errors.length > 0) return ErrorResponse("Invalid task creation body", 400)
    try {
        const user = await requireAuth(req)
        const userId = user.userId
        const saved = await taskRepo.create(body.description, body.due_date, userId)
        return Response.json({data: saved}, {status: 200})
    } catch (error: any) {
        return ErrorResponse(error.message || "Server error", error.status || 500)
    }
}

export async function updateTask(id: number, req: Request) {
    if (id <= 0) return ErrorResponse("Invalid id", 400)
    let body: any;
    try {
        body = await req.json();
    } catch {
        body = null;
    }
    if (!body || !body.id) return ErrorResponse("Invalid json body", 400)
    const errors = validateTaskBody(body)
    if (errors.length > 0) {
        return ErrorResponse("Invalid task update body", 400)
    }
    try {
        const user = await requireAuth(req)
        const userId = user.userId
        const updated = await taskRepo.update(body.id, body.description, body.due_date, userId, body.is_completed)
        return Response.json({data: updated}, {status: 200})
    } catch (error: any) {
        return ErrorResponse(error.message || "Server error", error.status || 500)
    }
}

export async function deleteTask(id: number, req: Request) {
    if (id <= 0) return ErrorResponse("Invalid id", 400)
    try {
        const user = await requireAuth(req)
        const userId = user.userId
        const deleted = await taskRepo.delete(id, userId)
        return Response.json({data: deleted}, {status: 200})
    } catch (error: any) {
        return ErrorResponse(error.message || "Server error", error.status || 500)
    }
}

export async function deleteAllTasks(req: Request) {
    try {
        const user = await requireAuth(req)
        const userId = user.userId
        const deleted = await taskRepo.deleteAll(userId)
        return Response.json({data: deleted}, {status: 200})
    } catch (error: any) {
        return ErrorResponse(error.message || "Server error", error.status || 500)
    }
}