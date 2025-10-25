import { Router } from "express";
import { createCase, createEntity, createTheory, createTimelineEvent } from "./db";

export const webhookRouter = Router();

/**
 * Webhook endpoint for receiving case data from external sources
 * POST /api/webhook/case
 * 
 * Expected payload:
 * {
 *   "userId": number,
 *   "title": string,
 *   "subject": string,
 *   "dateOfIncident": string (ISO 8601),
 *   "location": string,
 *   "description": string,
 *   "entities": [
 *     {
 *       "entityType": "person" | "location" | "company" | "disposal_site" | "exit_route" | "other",
 *       "name": string,
 *       "description": string,
 *       "metadata": string (JSON)
 *     }
 *   ],
 *   "theories": [
 *     {
 *       "title": string,
 *       "description": string,
 *       "probability": number (0-100),
 *       "verificationFormula": string
 *     }
 *   ],
 *   "timelineEvents": [
 *     {
 *       "eventTime": string (ISO 8601),
 *       "eventDescription": string,
 *       "significance": string
 *     }
 *   ]
 * }
 */
webhookRouter.post("/case", async (req, res) => {
  try {
    const { userId, title, subject, dateOfIncident, location, description, entities, theories, timelineEvents } = req.body;

    // Validate required fields
    if (!userId || !title || !subject) {
      return res.status(400).json({ error: "Missing required fields: userId, title, subject" });
    }

    // Create the case
    const newCase = await createCase({
      userId,
      title,
      subject,
      dateOfIncident: dateOfIncident ? new Date(dateOfIncident) : undefined,
      location,
      description,
    });

    // Create entities if provided
    if (entities && Array.isArray(entities)) {
      for (const entity of entities) {
        await createEntity({
          caseId: newCase.id,
          entityType: entity.entityType,
          name: entity.name,
          description: entity.description,
          metadata: entity.metadata,
        });
      }
    }

    // Create theories if provided
    if (theories && Array.isArray(theories)) {
      for (const theory of theories) {
        await createTheory({
          caseId: newCase.id,
          title: theory.title,
          description: theory.description,
          probability: theory.probability,
          verificationFormula: theory.verificationFormula,
        });
      }
    }

    // Create timeline events if provided
    if (timelineEvents && Array.isArray(timelineEvents)) {
      for (const event of timelineEvents) {
        await createTimelineEvent({
          caseId: newCase.id,
          eventTime: new Date(event.eventTime),
          eventDescription: event.eventDescription,
          significance: event.significance,
        });
      }
    }

    res.status(201).json({
      success: true,
      caseId: newCase.id,
      message: "Case created successfully via webhook",
    });
  } catch (error) {
    console.error("[Webhook] Error creating case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Webhook endpoint for health check
 * GET /api/webhook/health
 */
webhookRouter.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

