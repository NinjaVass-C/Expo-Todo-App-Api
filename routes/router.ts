import {authRoutes} from "./authRoutes.ts";
import {taskRoutes} from "./taskRoutes.ts";

export async function route(req: Request) {
    return (
        await authRoutes(req) ||
        await taskRoutes(req) ||
        new Response("Not Found", { status: 404 })
    );
}