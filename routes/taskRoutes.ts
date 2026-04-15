import {createTask, deleteAllTasks, deleteTask, getAllTasks, getTaskById, updateTask} from "../services/taskService.ts";


export async function taskRoutes(req: Request) {
    const url = new URL (req.url)

    if (req.method === "GET" && url.pathname === "/tasks/include_completed") {
        const include_completed = url.pathname.split("/")[2] ?? "";
        return await getAllTasks(req, Boolean(include_completed))
    }

    if (req.method === "GET" && url.pathname.startsWith("/task/")) {
        const id = url.pathname.split("/")[2] ?? "";
        return await getTaskById(parseInt(id), req)
    }

    if (req.method === "POST" && url.pathname === "/task") {
        return await createTask(req)
    }

    if (req.method === "PATCH" && url.pathname.startsWith("/task/")) {
        const id = url.pathname.split("/")[2] ?? "";
        return await updateTask(parseInt(id), req)
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/task/")) {
        const id = url.pathname.split("/")[2] ?? "";
        return await deleteTask(parseInt(id), req)
    }

    if (req.method === "DELETE" && url.pathname === "/tasks") {
        return await deleteAllTasks(req)
    }

    return null
}
