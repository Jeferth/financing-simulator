import { pgTable, text, integer, real, timestamp, serial } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  propertyValue: real("property_value"),
  downPayment: real("down_payment"),
  loanValue: real("loan_value"),
  termMonths: integer("term_months"),
  monthlyInstallment: real("monthly_installment"),
  totalPayable: real("total_payable"),
  createdAt: timestamp("created_at").defaultNow(),
});
