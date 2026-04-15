import {db} from "../db.ts"
import {taskTable} from "../schema.ts";
import {and, eq} from 'drizzle-orm';

export const taskRepo = {
    async getAll(userId: number, includeCompleted: boolean) {
        const conditions = [eq(taskTable.userId, userId)];

        if (!includeCompleted) {
            conditions.push(eq(taskTable.is_completed, false));
        }

        return db
            .select()
            .from(taskTable)
            .where(and(...conditions));
    },
    async getOne(id: number, userId: number) {
        return db.select().from(taskTable)
            .where(and(eq(taskTable.id, id), eq(taskTable.userId, userId)))
            .get()
    },
    async create(description: string, dueDate: number, userId: number) {
        console.log(new Date(dueDate));
        return db.insert(taskTable).values({
            userId,
            description,
            due_date: new Date(dueDate),
        }).returning();
    },
    async update(id: number, description: string, dueDate: number, userId: number, is_completed: boolean) {
        return db.update(taskTable).set({
            description,
            is_completed,
            due_date: new Date(dueDate),
        }).where(and(eq(taskTable.id, id), eq(taskTable.userId, userId)))
            .returning();
    },
    async delete(id: number, userId: number) {
        return db.delete(taskTable)
            .where(and(eq(taskTable.id, id), eq(taskTable.userId, userId)))
            .returning();
    },
    async deleteAll(userId: number) {
        return db.delete(taskTable)
            .where(eq(taskTable.userId, userId)).returning();
    }

}