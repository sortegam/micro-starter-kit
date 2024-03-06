import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// #################################################################
// # userTable
// #################################################################

export const users = sqliteTable('users', {
  id: text('id')
    .notNull()
    .unique()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').unique(),
  emailVerified: integer('email_verified').notNull().default(0),
  username: text('username')
    .unique()
    .default(sql`NULL`),
  usernameNormalized: text('username_normalized')
    .unique()
    .default(sql`NULL`),
  failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// #################################################################
// # sessionTable
// #################################################################

export const sessions = sqliteTable('sessions', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

// #################################################################
// # verificationCodeTable
// #################################################################

export const verificationCodes = sqliteTable('verification_codes', {
  id: text('id')
    .notNull()
    .unique()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  expiresAt: integer('expires_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// #################################################################
// # oauthAccounts
// #################################################################

export const oauthAccounts = sqliteTable(
  'oauth_accounts',
  {
    providerId: text('provider_id').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  })
);

// #################################################################
// # userSettingsTable
// #################################################################

export const userSettings = sqliteTable('user_settings', {
  id: text('id')
    .notNull()
    .unique()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  updatedAt: integer('updated_at').default(sql`NULL`),
  appearanceDarkTheme: integer('appearance_dark_theme').notNull().default(1),
  notificationsNewsletterSubscription: integer(
    'notifications_newsletter_subscription'
  )
    .notNull()
    .default(1),
});
