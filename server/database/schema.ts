import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const simulations = sqliteTable("simulations", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  propertyValue: real("property_value"),
  downPayment: real("down_payment"),
  loanValue: real("loan_value"),
  termMonths: integer("term_months"),
  monthlyInstallment: real("monthly_installment"),
  totalPayable: real("total_payable"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
