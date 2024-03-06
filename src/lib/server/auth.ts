import { Lucia, TimeSpan } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { Google, Discord } from 'arctic';
import {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '$env/static/private';
import { db, users, sessions } from './db';

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'd'), // 1 day
  sessionCookie: {
    attributes: {
      secure: true,
      sameSite: 'strict',
    },
  },
  // What it does is to get the user attributes from the database
  // and expose them here in the user attribute:
  // const { session, user } = await lucia.validateSession(sessionId);
  // We are using this manually here: src/hooks.server.ts
  // since the type inference doesn't work good un lucia yet. :/
  // getUserAttributes: (attributes) => ({}),
});

interface AuthOptions {
  basePath?: string;
}

export const googleAuth = (options: AuthOptions) =>
  new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${options.basePath}/login/google/callback/`
  );

export const discordAuth = (options: AuthOptions) =>
  new Discord(
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    `${options.basePath}/login/discord/callback/`
  );
