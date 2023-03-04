import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/utils/env.mjs";
import { createTRPCContext } from "~/utils/server/api/trpc";
import { appRouter } from "~/utils/server/api/root";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
