import { createUser, login } from "../services/authService.ts";

export async function authRoutes(req: Request) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/auth/register") {
        return createUser(req);
    }

    if (req.method === "POST" && url.pathname === "/auth/login") {
        return login(req);
    }

    return null;
}