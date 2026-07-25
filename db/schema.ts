import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const frontierSignals = sqliteTable(
  "frontier_signals",
  {
    id: text("id").primaryKey(),
    fingerprint: text("fingerprint").notNull(),
    title: text("title").notNull(),
    source: text("source").notNull(),
    url: text("url").notNull(),
    publishedAt: text("published_at").notNull(),
    score: integer("score").notNull(),
    category: text("category").notNull(),
    changeState: text("change_state").notNull().default("NEW"),
    firstSeenAt: text("first_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastSeenAt: text("last_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("frontier_signals_published_idx").on(table.publishedAt),
    index("frontier_signals_category_idx").on(table.category),
  ],
);

export const agentSweeps = sqliteTable(
  "agent_sweeps",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    trigger: text("trigger").notNull(),
    status: text("status").notNull(),
    startedAt: text("started_at").notNull(),
    completedAt: text("completed_at").notNull(),
    sourceCount: integer("source_count").notNull(),
    signalCount: integer("signal_count").notNull(),
    newCount: integer("new_count").notNull(),
    updatedCount: integer("updated_count").notNull(),
    shiftYears: real("shift_years").notNull(),
    confidenceModifier: integer("confidence_modifier").notNull(),
    direction: text("direction").notNull(),
    pressureJson: text("pressure_json").notNull(),
    rationale: text("rationale").notNull(),
  },
  (table) => [index("agent_sweeps_completed_idx").on(table.completedAt)],
);
