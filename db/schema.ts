import { sql } from "drizzle-orm";
import {
    int,
    sqliteTable,
    text,
    integer,
} from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull(),
    password: text().notNull(),
    created_at: integer({ mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const taskTable = sqliteTable("tasks", {
    id: int().primaryKey({ autoIncrement: true }),
    userId: int()
        .notNull()
        .references(() => usersTable.id),
    description: text().notNull(),
    is_completed: integer({ mode: "boolean" })
        .notNull()
        .default(false),
    due_date: integer({ mode: "timestamp" }),
    created_at: integer({ mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});