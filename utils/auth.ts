import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.SECRET);

export async function requireAuth(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        throw new Error("Missing Authorization header");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new Error("Missing token");
    }

    try {
        const { payload } = await jwtVerify(token, SECRET);

        return {
            userId: payload.userId as number,
            username: payload.username as string,
        };
    } catch {
        throw new Error("Invalid token");
    }
}