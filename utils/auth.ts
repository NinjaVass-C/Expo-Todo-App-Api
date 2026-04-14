import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.SECRET);

export async function requireAuth(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        throw {message: "Missing authorization header", status: 400}
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw { message: "Missing token", status: 400 };
    }

    try {
        const { payload } = await jwtVerify(token, SECRET);

        return {
            userId: payload.userId as number,
            username: payload.username as string,
        };
    } catch {
        throw { message: "Unauthorized", status: 401 };
    }
}