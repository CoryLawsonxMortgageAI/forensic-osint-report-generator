import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cases table - stores OSINT investigation cases
 */
export const cases = mysqlTable("cases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  dateOfIncident: timestamp("dateOfIncident"),
  location: text("location"),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "in_progress", "completed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Case = typeof cases.$inferSelect;
export type InsertCase = typeof cases.$inferInsert;

/**
 * Entities table - stores people, locations, companies, etc. related to cases
 */
export const entities = mysqlTable("entities", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  entityType: mysqlEnum("entityType", [
    "person",
    "location",
    "company",
    "disposal_site",
    "exit_route",
    "other"
  ]).notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  description: text("description"),
  metadata: text("metadata"), // JSON string for flexible data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Entity = typeof entities.$inferSelect;
export type InsertEntity = typeof entities.$inferInsert;

/**
 * Relationships table - stores connections between entities
 */
export const relationships = mysqlTable("relationships", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  fromEntityId: int("fromEntityId").notNull(),
  toEntityId: int("toEntityId").notNull(),
  relationshipType: varchar("relationshipType", { length: 200 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = typeof relationships.$inferInsert;

/**
 * Theories table - stores investigative theories and scenarios
 */
export const theories = mysqlTable("theories", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  probability: int("probability").notNull(), // 0-100
  status: mysqlEnum("status", ["verified", "eliminated", "pending"]).default("pending").notNull(),
  verificationFormula: text("verificationFormula"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Theory = typeof theories.$inferSelect;
export type InsertTheory = typeof theories.$inferInsert;

/**
 * Timeline events table - stores chronological events for cases
 */
export const timelineEvents = mysqlTable("timeline_events", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  eventTime: timestamp("eventTime").notNull(),
  eventDescription: text("eventDescription").notNull(),
  significance: text("significance"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = typeof timelineEvents.$inferInsert;

/**
 * Reports table - stores generated reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  reportType: mysqlEnum("reportType", ["markdown", "pdf"]).default("markdown").notNull(),
  content: text("content").notNull(), // Markdown or reference to S3
  graphData: text("graphData"), // JSON string for Maltego graph
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Webhooks table - stores webhook configurations for external data sources
 */
export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  webhookUrl: varchar("webhookUrl", { length: 1000 }).notNull(),
  webhookSecret: varchar("webhookSecret", { length: 200 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;

