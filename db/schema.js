//import { timestamp } from "drizzle-orm/gel-core";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todo:text().notNull(),
  createdtAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()

});