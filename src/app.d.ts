// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      // We need to add this to the Locals interface to make it available
      // in the event.locals object. Unfortunately there is no other way to
      // do it. Since we can't infer the type of the user from drizzle-orm
      user: {
        id: string;
        email: string | null;
        emailVerified: number;
        username: string | null;
        usernameNormalized: string | null;
        failedLoginAttempts: number;
        createdAt: number;
      } | null;
      session: import('lucia').Session | null;
    }
    interface PageData {
      flash?: { type: 'success' | 'error'; message: string };
    }
  }
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}

// This is a hack to make typescript not complaining when using image tools
// https://github.com/JonasKruckenberg/imagetools/issues/160#issuecomment-965021959
declare global {
  declare module '*&imagetools' {
    /**
     * actual types
     * - code https://github.com/JonasKruckenberg/imagetools/blob/main/packages/core/src/output-formats.ts
     * - docs https://github.com/JonasKruckenberg/imagetools/blob/main/docs/guide/getting-started.md#metadata
     */
    const out;
    export default out;
  }
}

import 'unplugin-icons/types/svelte';

export {};
