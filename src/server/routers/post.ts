import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  content: true,
  // createdAt: true,
  // updatedAt: true,
});

export const postRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).nullish() }))
    .query(async ({ input }) => {
      const items = await prisma.post.findMany({
        select: defaultPostSelect,
        take: input.limit ?? 50,
        orderBy: {
          createdAt: "desc",
        },
      });
      return { items };
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const post = await prisma.post.create({
        data: input,
      });
      return post;
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: input.id,
        },
        select: defaultPostSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id ${input.id}`,
        });
      }
      return post;
    }),
});
