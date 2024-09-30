import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const departmentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.department.findMany({
      include: { employees: true },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.department.create({
        data: {
          name: input.name,
          status: input.status,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.department.update({
        where: { id: input.id },
        data: {
          name: input.name,
          status: input.status,
        },
      });
    }),

  delete: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    await ctx.db.department.delete({ where: { id: input } });
  }),
});
