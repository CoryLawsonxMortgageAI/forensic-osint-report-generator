import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  cases,
  InsertCase,
  Case,
  entities,
  InsertEntity,
  Entity,
  relationships,
  InsertRelationship,
  Relationship,
  theories,
  InsertTheory,
  Theory,
  timelineEvents,
  InsertTimelineEvent,
  TimelineEvent,
  reports,
  InsertReport,
  Report,
  webhooks,
  InsertWebhook,
  Webhook,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== User Management =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Case Management =====

export async function createCase(caseData: InsertCase): Promise<Case> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cases).values(caseData);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(cases).where(eq(cases.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getCasesByUserId(userId: number): Promise<Case[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cases).where(eq(cases.userId, userId)).orderBy(desc(cases.updatedAt));
}

export async function getCaseById(caseId: number): Promise<Case | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1);
  return result[0];
}

export async function updateCase(caseId: number, updates: Partial<InsertCase>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cases).set(updates).where(eq(cases.id, caseId));
}

export async function deleteCase(caseId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cases).where(eq(cases.id, caseId));
}

// ===== Entity Management =====

export async function createEntity(entityData: InsertEntity): Promise<Entity> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(entities).values(entityData);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(entities).where(eq(entities.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getEntitiesByCaseId(caseId: number): Promise<Entity[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(entities).where(eq(entities.caseId, caseId));
}

export async function updateEntity(entityId: number, updates: Partial<InsertEntity>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(entities).set(updates).where(eq(entities.id, entityId));
}

export async function deleteEntity(entityId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(entities).where(eq(entities.id, entityId));
}

// ===== Relationship Management =====

export async function createRelationship(relationshipData: InsertRelationship): Promise<Relationship> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(relationships).values(relationshipData);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(relationships).where(eq(relationships.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getRelationshipsByCaseId(caseId: number): Promise<Relationship[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(relationships).where(eq(relationships.caseId, caseId));
}

export async function deleteRelationship(relationshipId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(relationships).where(eq(relationships.id, relationshipId));
}

// ===== Theory Management =====

export async function createTheory(theoryData: InsertTheory): Promise<Theory> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(theories).values(theoryData);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(theories).where(eq(theories.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getTheoriesByCaseId(caseId: number): Promise<Theory[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(theories).where(eq(theories.caseId, caseId)).orderBy(desc(theories.probability));
}

export async function updateTheory(theoryId: number, updates: Partial<InsertTheory>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(theories).set(updates).where(eq(theories.id, theoryId));
}

export async function deleteTheory(theoryId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(theories).where(eq(theories.id, theoryId));
}

// ===== Timeline Event Management =====

export async function createTimelineEvent(eventData: InsertTimelineEvent): Promise<TimelineEvent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(timelineEvents).values(eventData);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(timelineEvents).where(eq(timelineEvents.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getTimelineEventsByCaseId(caseId: number): Promise<TimelineEvent[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(timelineEvents).where(eq(timelineEvents.caseId, caseId)).orderBy(timelineEvents.eventTime);
}

export async function deleteTimelineEvent(eventId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(timelineEvents).where(eq(timelineEvents.id, eventId));
}

// ===== Report Management =====

export async function createReport(reportData: InsertReport): Promise<Report> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reports).values(reportData);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(reports).where(eq(reports.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getReportsByCaseId(caseId: number): Promise<Report[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(reports).where(eq(reports.caseId, caseId)).orderBy(desc(reports.createdAt));
}

export async function getReportById(reportId: number): Promise<Report | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1);
  return result[0];
}

// ===== Webhook Management =====

export async function createWebhook(webhookData: InsertWebhook): Promise<Webhook> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(webhooks).values(webhookData);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(webhooks).where(eq(webhooks.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getWebhooksByCaseId(caseId: number): Promise<Webhook[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(webhooks).where(eq(webhooks.caseId, caseId));
}

export async function deleteWebhook(webhookId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(webhooks).where(eq(webhooks.id, webhookId));
}

