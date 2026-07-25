CREATE TABLE `agent_sweeps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trigger` text NOT NULL,
	`status` text NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text NOT NULL,
	`source_count` integer NOT NULL,
	`signal_count` integer NOT NULL,
	`new_count` integer NOT NULL,
	`updated_count` integer NOT NULL,
	`shift_years` real NOT NULL,
	`confidence_modifier` integer NOT NULL,
	`direction` text NOT NULL,
	`pressure_json` text NOT NULL,
	`rationale` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `agent_sweeps_completed_idx` ON `agent_sweeps` (`completed_at`);--> statement-breakpoint
CREATE TABLE `frontier_signals` (
	`id` text PRIMARY KEY NOT NULL,
	`fingerprint` text NOT NULL,
	`title` text NOT NULL,
	`source` text NOT NULL,
	`url` text NOT NULL,
	`published_at` text NOT NULL,
	`score` integer NOT NULL,
	`category` text NOT NULL,
	`change_state` text DEFAULT 'NEW' NOT NULL,
	`first_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `frontier_signals_published_idx` ON `frontier_signals` (`published_at`);--> statement-breakpoint
CREATE INDEX `frontier_signals_category_idx` ON `frontier_signals` (`category`);