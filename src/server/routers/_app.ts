import { postRouter } from "./post";
import { router } from "../trpc";

export const appRouter = router({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
