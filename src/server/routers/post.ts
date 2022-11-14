import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).nullish() }))
    .query(async ({ input }) => {
      const items = [
        {
          id: "cef0d278-166f-4660-901d-79920a44cf4f",
          title: "Proin risus.",
          content:
            "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
        },
        {
          id: "b14b889d-e15d-4ce1-96b8-96ae09b9a8f9",
          title:
            "Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat.",
          content:
            "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        },
        {
          id: "b3c3d79b-82d1-406c-b5ef-7eaf3e03134b",
          title: "Curabitur at ipsum ac tellus semper interdum.",
          content:
            "Fusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
        },
      ];
      return { items };
    }),
});
