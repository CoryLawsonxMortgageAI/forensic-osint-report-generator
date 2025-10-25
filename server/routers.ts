import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cases: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getCasesByUserId } = await import("./db");
      return getCasesByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { title: string; subject: string; dateOfIncident?: string; location?: string; description?: string };
        return data;
      })
      .mutation(async ({ ctx, input }) => {
        const { createCase } = await import("./db");
        return createCase({
          userId: ctx.user.id,
          title: input.title,
          subject: input.subject,
          dateOfIncident: input.dateOfIncident ? new Date(input.dateOfIncident) : undefined,
          location: input.location,
          description: input.description,
        });
      }),
    getById: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number };
        return data;
      })
      .query(async ({ input }) => {
        const { getCaseById } = await import("./db");
        return getCaseById(input.id);
      }),
    update: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number; updates: { title?: string; subject?: string; status?: "draft" | "in_progress" | "completed"; description?: string } };
        return data;
      })
      .mutation(async ({ input }) => {
        const { updateCase } = await import("./db");
        await updateCase(input.id, input.updates);
        return { success: true };
      }),
    delete: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number };
        return data;
      })
      .mutation(async ({ input }) => {
        const { deleteCase } = await import("./db");
        await deleteCase(input.id);
        return { success: true };
      }),
  }),

  entities: router({
    list: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { caseId: number };
        return data;
      })
      .query(async ({ input }) => {
        const { getEntitiesByCaseId } = await import("./db");
        return getEntitiesByCaseId(input.caseId);
      }),
    create: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { caseId: number; entityType: "person" | "location" | "company" | "disposal_site" | "exit_route" | "other"; name: string; description?: string; metadata?: string };
        return data;
      })
      .mutation(async ({ input }) => {
        const { createEntity } = await import("./db");
        return createEntity(input);
      }),
    update: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number; updates: { name?: string; description?: string; metadata?: string } };
        return data;
      })
      .mutation(async ({ input }) => {
        const { updateEntity } = await import("./db");
        await updateEntity(input.id, input.updates);
        return { success: true };
      }),
    delete: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number };
        return data;
      })
      .mutation(async ({ input }) => {
        const { deleteEntity } = await import("./db");
        await deleteEntity(input.id);
        return { success: true };
      }),
  }),

  theories: router({
    list: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { caseId: number };
        return data;
      })
      .query(async ({ input }) => {
        const { getTheoriesByCaseId } = await import("./db");
        return getTheoriesByCaseId(input.caseId);
      }),
    create: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { caseId: number; title: string; description: string; probability: number; verificationFormula?: string };
        return data;
      })
      .mutation(async ({ input }) => {
        const { createTheory } = await import("./db");
        return createTheory(input);
      }),
    update: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number; updates: { title?: string; description?: string; probability?: number; status?: "verified" | "eliminated" | "pending"; verificationFormula?: string } };
        return data;
      })
      .mutation(async ({ input }) => {
        const { updateTheory } = await import("./db");
        await updateTheory(input.id, input.updates);
        return { success: true };
      }),
    delete: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number };
        return data;
      })
      .mutation(async ({ input }) => {
        const { deleteTheory } = await import("./db");
        await deleteTheory(input.id);
        return { success: true };
      }),
  }),

  reports: router({
    list: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { caseId: number };
        return data;
      })
      .query(async ({ input }) => {
        const { getReportsByCaseId } = await import("./db");
        return getReportsByCaseId(input.caseId);
      }),
    generate: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { caseId: number };
        return data;
      })
      .mutation(async ({ input }) => {
        const { getCaseById, getEntitiesByCaseId, getTheoriesByCaseId, getTimelineEventsByCaseId, getRelationshipsByCaseId, createReport } = await import("./db");
        const { generateMarkdownReport, generateMaltegoGraphData } = await import("./reportGenerator");

        const caseData = await getCaseById(input.caseId);
        if (!caseData) throw new Error("Case not found");

        const entities = await getEntitiesByCaseId(input.caseId);
        const theories = await getTheoriesByCaseId(input.caseId);
        const timelineEvents = await getTimelineEventsByCaseId(input.caseId);
        const relationships = await getRelationshipsByCaseId(input.caseId);

        const reportData = {
          case: caseData,
          entities,
          theories,
          timelineEvents,
          relationships,
        };

        const content = generateMarkdownReport(reportData);
        const graphData = generateMaltegoGraphData(reportData);

        return createReport({
          caseId: input.caseId,
          reportType: "markdown",
          content,
          graphData,
        });
      }),
    getById: protectedProcedure
      .input((raw: unknown) => {
        const data = raw as { id: number };
        return data;
      })
      .query(async ({ input }) => {
        const { getReportById } = await import("./db");
        return getReportById(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
