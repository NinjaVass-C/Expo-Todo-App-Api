import {db} from "../db.ts";
import {usersTable} from "../schema.ts";
import {eq} from "drizzle-orm";

export const userRepo = {
    async create(username: string, password: string) {
        const result = await db.insert(usersTable).values({
            username,
            password,
        });
    },
    async getOne(username: string) {
        return db.select().from(usersTable)
            .where(eq(usersTable.username, username))
            .get();
    },
    async getById(id: number) {
        return db.select().from(usersTable)
            .where(eq(usersTable.id, id))
            .get()
    }

}