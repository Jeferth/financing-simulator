CREATE TABLE `simulations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`property_value` real,
	`down_payment` real,
	`loan_value` real,
	`term_months` integer,
	`monthly_installment` real,
	`total_payable` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
