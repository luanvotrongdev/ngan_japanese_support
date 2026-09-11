CREATE TABLE `grammar` (
	`id` text PRIMARY KEY NOT NULL,
	`study_session_id` text NOT NULL,
	`grammar` text NOT NULL,
	`usage` text NOT NULL,
	`meaning` text NOT NULL,
	`nuance` text,
	`examples` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`study_session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `grammar_session_idx` ON `grammar` (`study_session_id`);--> statement-breakpoint
CREATE TABLE `kanji` (
	`id` text PRIMARY KEY NOT NULL,
	`study_session_id` text NOT NULL,
	`kanji` text NOT NULL,
	`onyomi` text NOT NULL,
	`kunyomi` text NOT NULL,
	`meaning` text NOT NULL,
	`related_vocabulary` text NOT NULL,
	`examples` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`study_session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `kanji_session_idx` ON `kanji` (`study_session_id`);--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `study_sessions_owner_updated_idx` ON `study_sessions` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`study_session_id` text NOT NULL,
	`vocabulary` text NOT NULL,
	`reading` text NOT NULL,
	`meaning` text NOT NULL,
	`nuance` text,
	`examples` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`study_session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `vocabulary_session_idx` ON `vocabulary` (`study_session_id`);