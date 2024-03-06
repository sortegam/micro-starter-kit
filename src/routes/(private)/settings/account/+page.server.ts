import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { render } from 'svelte-email';
import { MAIL_FROM_ADDRESS } from '$env/static/private';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { emailSender } from '$lib/server/sendEmail';
import { getAccountSchema } from './account.schema';
import { PUBLIC_PROJECT_NAME } from '$env/static/public';
import type { PageServerLoad } from './$types';
import AccountDeleteTemplate from '$lib/email-templates/AccountDelete.svelte';
import { valibot } from 'sveltekit-superforms/adapters';
import { lucia } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { db, users } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
  const sessionUsername = event.locals.user?.username;
  if (!sessionUsername) {
    return redirect(302, '/');
  }
  const accountForm = await superValidate(
    event.request,
    valibot(getAccountSchema({ username: sessionUsername }))
  );

  return {
    accountForm,
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.user) {
      return redirect(302, '/');
    }
    const sessionUsername = event.locals.user?.username;
    if (!sessionUsername) {
      return redirect(302, '/');
    }

    // Use superValidate in form actions too, but with the request
    const accountForm = await superValidate(
      event.request,
      valibot(getAccountSchema({ username: sessionUsername }))
    );

    // Convenient validation check:
    if (!accountForm.valid) {
      // Again, always return { form } and things will just work.
      setFlash(
        {
          type: 'error',
          message: `Oups! Sorry, there was an error deleting the account.`,
        },
        event
      );
      return fail(400, { accountForm });
    }

    // #################################################################
    // # Send good bye email
    // #################################################################

    const html = render({
      template: AccountDeleteTemplate,
      props: {
        username: sessionUsername,
      },
    });
    const text = render({
      template: AccountDeleteTemplate,
      props: {
        username: sessionUsername,
      },
      options: {
        plainText: true,
      },
    });

    if (event.locals.user.email) {
      await emailSender.sendMail({
        from: MAIL_FROM_ADDRESS,
        to: event.locals.user.email,
        subject: `📧 Account deletion ${PUBLIC_PROJECT_NAME}`,
        text,
        html,
      });
    }

    await db.delete(users).where(eq(users.id, event.locals.user.id));

    if (event.locals.user.id) {
      await lucia.invalidateUserSessions(event.locals.user.id);
    }

    redirect(
      302,
      '/',
      { type: 'success', message: `Your account has been deleted!` },
      event
    );
  },
};
