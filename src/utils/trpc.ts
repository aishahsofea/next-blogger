import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { NextPageContext } from "next";
import superjson from "superjson";
import { AppRouter } from "~/server/routers/_app";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export interface SSRContext extends NextPageContext {
  status?: number;
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              const { connection: _connection, ...headers } = ctx.req.headers;
              return { ...headers, "x-ssr": "1" };
            }
            return {};
          },
        }),
      ],
    };
  },
  ssr: true,
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;
    if (ctx.status) {
      return { status: ctx.status };
    }

    const error = opts.clientErrors[0];
    if (error) {
      return { status: error.data?.httpStatus ?? 500 };
    }

    return {};
  },
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
