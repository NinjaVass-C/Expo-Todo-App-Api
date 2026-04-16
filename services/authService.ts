import {validateUserBody} from "../utils/validateRequests.ts";
import {ErrorResponse} from "../utils/errorResponse.ts";
import {userRepo} from "../db/repos/userRepo.ts";
import {jwtVerify, SignJWT} from "jose";
import {requireAuth} from "../utils/auth.ts";



export async function createUser(req: Request) {
    let body: any;
    try {
        body = await req.json();
    } catch {
        body = null;
    }
    if (!body) {
        return ErrorResponse("Invalid json", 400)
    }
    const errors = validateUserBody(body)
    if (errors.length) {
        return ErrorResponse("Invalid username or password", 400)
    }
    const username: string = body.username.trim()
    const exists = await userRepo.getOne(username)
    if (exists) {
        return ErrorResponse("Username already exists", 409)
    }
    const password: string = body.password.trim()
    const hashedPassword = await Bun.password.hash(password)

    await userRepo.create(username, hashedPassword)
    return Response.json({message: "user added"}, {status: 200});
}

export async function login(req: Request) {
    const SECRET = new TextEncoder().encode(process.env.SECRET);
    let body: any;
    try {
        body = await req.json();
    } catch {
        body = null;
    }
    if (!body) {
        return ErrorResponse("Invalid json", 400);
    }

    const errors = validateUserBody(body);
    if (errors.length) {
        return ErrorResponse("Invalid username or password", 401);
    }

    const username: string = body.username.trim();
    const password: string = body.password;

    const user = await userRepo.getOne(username);

    if (!user) {
        return ErrorResponse("Invalid username or password", 401)
    }
    const isValid = await Bun.password.verify(password, user.password);

    if (!isValid) {
        return ErrorResponse("Invalid username or password", 401);
    }

    const token = await new SignJWT({
        userId: user.id,
        username: user.username,
    })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET);

    return Response.json({
        token, username
    }, { status: 200 });
}

export async function validateToken(req: Request) {
    try {
        const user = await requireAuth(req);
        if (!user) throw new Error("Invalid token");
        const validUser = await userRepo.getById(user.userId)
        console.log(validUser)
        if (!validUser) {
            throw new Error("Invalid token");
        }
        return Response.json({user}, {status: 200});
    } catch (error: any) {
        return ErrorResponse(error.message || "Unauthorized", 401);
    }
}
