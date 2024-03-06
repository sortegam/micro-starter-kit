import { fail, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { render } from 'svelte-email';
import { MAIL_FROM_ADDRESS } from '$env/static/private';
import { redirect } from 'sveltekit-flash-message/server';
import { emailSender } from '$lib/server/sendEmail';
import { onboardSchema } from './onboard.schema';
import { PUBLIC_PROJECT_NAME } from '$env/static/public';
import type { PageServerLoad } from './$types';
import WelcomeTemplate from '$lib/email-templates/Welcome.svelte';
import { checkUserAvailability } from './user-available/checkUserAvailability';
import { ERROR_MESSAGE_USERNAME_TAKEN } from './constants';
import { isBlacklistedUsername } from '$lib/server/blacklistedUsernames';
import { initialPathForLoggedUsers } from '$config';
import { db, userSettings, users } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { valibot } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
  const onboardForm = await superValidate(
    event.request,
    valibot(onboardSchema)
  );

  // If no session id created or username already created
  // move out from this page
  if (!event.locals.session?.userId || event.locals.user?.username) {
    redirect(302, '/');
  }

  // #################################################################
  // # Try to generate a username proposal
  // # If the username is already taken, try to generate another one
  // # If all proposals are taken, the user will have to choose one manually
  // #################################################################
  if (!onboardForm.data.username && event.locals.user?.email) {
    // Generate username proposal
    const usernameBase = event.locals.user.email.split('@')[0];

    // Get a random number from 1 to 100
    const randomNumber1 = (Math.floor(Math.random() * 10) + 1).toString();
    const randomNumber2 = (Math.floor(Math.random() * 100) + 1).toString();
    const randomNumber3 = (Math.floor(Math.random() * 1000) + 1).toString();
    const suffixes = ['', '_', randomNumber1, randomNumber2, randomNumber3];
    for (let i = 0; i < suffixes.length; i++) {
      const usernameToTry = `${usernameBase}${suffixes[i]}`;
      const available = await checkUserAvailability({
        username: usernameToTry,
        locals: event.locals,
      });
      if (available) {
        onboardForm.data.username = usernameToTry;
        break;
      }
    }
  }

  return {
    onboardForm,
  };
};

export const actions: Actions = {
  default: async (event) => {
    // Use superValidate in form actions too, but with the request
    const onboardForm = await superValidate(
      event.request,
      valibot(onboardSchema)
    );

    // Convenient validation check:
    if (!onboardForm.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { onboardForm });
    }

    // Check if user already exists or is blacklisted
    // We don't get info about blacklisted users. We just return a generic error
    // message.

    if (
      false ===
        (await checkUserAvailability({
          username: onboardForm.data.username,
          locals: event.locals,
        })) ||
      isBlacklistedUsername(onboardForm.data.username)
    ) {
      return setError(onboardForm, 'username', ERROR_MESSAGE_USERNAME_TAKEN);
    }

    const userId = event.locals.session?.userId;

    if (!userId) {
      redirect(
        302,
        '/',
        { type: 'error', message: 'Error authenticating user' },
        event
      );
    }

    const user = db
      .update(users)
      .set({
        username: onboardForm.data.username,
        usernameNormalized: onboardForm.data.username.toLowerCase(),
      })
      .where(eq(users.id, userId))
      .returning()
      .get();

    if (!user.email) {
      redirect(
        302,
        '/',
        { type: 'error', message: 'Error sending onboard email' },
        event
      );
    }

    // #################################################################
    // # Create Settings
    // #################################################################

    // This will initialize the user settings on database
    await db.insert(userSettings).values({ userId });

    // #################################################################
    // # Send welcome email
    // #################################################################

    const html = render({
      template: WelcomeTemplate,
      props: {
        username: onboardForm.data.username,
      },
    });
    const text = render({
      template: WelcomeTemplate,
      props: {
        username: onboardForm.data.username,
      },
      options: {
        plainText: true,
      },
    });

    emailSender.sendMail({
      from: MAIL_FROM_ADDRESS,
      to: user.email,
      subject: `👋 Welcome to ${PUBLIC_PROJECT_NAME}`,
      text,
      html,
    });

    redirect(
      302,
      initialPathForLoggedUsers,
      { type: 'success', message: `Welcome ${onboardForm.data.username}!` },
      event
    );
  },
};
