import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const employeeRouter = createTRPCRouter({
  // Get all employees
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.employee.findMany();
  }),

  // Get an employee by ID
  getById: protectedProcedure
    .input(z.number().int().positive()) // Ensure ID is a positive integer
    .query(({ input, ctx }) => {
      return ctx.prisma.employee.findUnique({
        where: { id: input },
      });
    }),

  // Create a new employee
  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required."),
        lastName: z.string().min(1, "Last name is required."),
        telephone: z.string().optional(), // Assuming phone can be optional
        email: z.string().email("Invalid email address."),
        managerId: z.number().optional(),
        status: z.enum(["Active", "Inactive"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.employee.create({
        data: input,
      });
    }),

  // Update an existing employee
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(), // Ensure ID is a positive integer
        firstName: z.string().min(1, "First name is required."),
        lastName: z.string().min(1, "Last name is required."),
        phone: z.string().optional(), // Assuming phone can be optional
        email: z.string().email("Invalid email address."),
        managerId: z.number().optional(),
        status: z.enum(["Active", "Inactive"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.employee.update({
        where: { id: input.id },
        data: input,
      });
    }),

  // Delete an employee by ID
  delete: protectedProcedure
    .input(z.number().int().positive()) // Ensure ID is a positive integer
    .mutation(({ input, ctx }) => {
      return ctx.prisma.employee.delete({
        where: { id: input },
      });
    }),
});
