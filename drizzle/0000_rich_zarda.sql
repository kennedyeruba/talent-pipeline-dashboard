CREATE TABLE `candidates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`stage` text DEFAULT 'Sourced' NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "candidates_stage_check" CHECK("candidates"."stage" IN ('Sourced', 'Screening', 'Interview', 'Hired'))
);
