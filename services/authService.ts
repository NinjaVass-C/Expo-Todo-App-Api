import {validateUserBody} from "../utils/validateRequests.ts";
import {ErrorResponse} from "../utils/errorResponse.ts";
import {userRepo} from "../db/repos/userRepo.ts";
import { SignJWT } from "jose";



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
    if (exists.length > 0) {
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
    console.log("did we hit the api?")
    if (!body) {
        return ErrorResponse("Invalid json", 400);
    }

    const errors = validateUserBody(body);
    if (errors.length) {
        return ErrorResponse("Invalid username or password", 401);
    }

    const username: string = body.username.trim();
    const password: string = body.password;

    const users = await userRepo.getOne(username);
    const user = users[0];

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
        token,
    }, { status: 200 });
}