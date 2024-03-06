import { fail, type Actions, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import SignUpTemplate from '$lib/email-templates/Signup.svelte';
import SignInTemplate from '$lib/email-templates/Signin.svelte';
import { render } from 'svelte-email';
import {
  MAIL_FROM_ADDRESS,
  PROJECT_PREFIX,
  RATE_LIMITER_COOKIE_SECRET,
  RATE_LIMITER_ENABLED,
} from '$env/static/private';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { emailSender } from '$lib/server/sendEmail';
import { loginCheckEmailSchema } from './loginCheckEmail.schema';
import { PUBLIC_PROJECT_NAME } from '$env/static/public';
import type { PageServerLoad } from './$types';
import { generateVerificationCodeForUserId } from '$lib/server/verificationCode';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { initialPathForLoggedUsers } from '$config';
import { db, users } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { valibot } from 'sveltekit-superforms/adapters';

// This is the rate limiter for this specific page
const limiter = new RateLimiter({
  // A rate is defined as [number, unit]
  rates: {
    IP: [53, 'm'], // IP address limiter
    IPUA: [52, 'm'], // IP + User Agent limiter
    cookie: {
      // Cookie limiter
      name: `${PROJECT_PREFIX}_rl_login`, // Unique cookie name for this limiter
      secret: RATE_LIMITER_COOKIE_SECRET,
      rate: [51, 'm'],
      preflight: true, // Require preflight call (see load function)
    },
  },
});

// #################################################################

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, initialPathForLoggedUsers);
  }
  // Without this line all the direct posts to this route will be blocked :)
  if (RATE_LIMITER_ENABLED === 'true') {
    limiter.cookieLimiter?.preflight(event);
  }
  const loginForm = await superValidate(
    event.request,
    valibot(loginCheckEmailSchema)
  );

  return {
    loginForm,
  };
};

// #################################################################

export const actions: Actions = {
  default: async (event) => {
    // Every call to isLimited counts as a hit towards the rate limit for the event.
    if (RATE_LIMITER_ENABLED === 'true' && (await limiter.isLimited(event)))
      error(429);

    // Use superValidate in form actions too, but with the request
    const loginForm = await superValidate(
      event.request,
      valibot(loginCheckEmailSchema)
    );

    // Convenient validation check:
    if (!loginForm.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { loginForm });
    }

    // #################################################################
    // # User checking - exists in the platform?
    // #################################################################

    const user = db
      .select()
      .from(users)
      .where(eq(users.email, loginForm.data.email.toLowerCase()))
      .limit(1)
      .get();

    // #################################################################
    // # User does not exists! (Prepare onboard email)
    // # Take into account that we are not going to need email verification :)
    // # Because the first step in the flow for signing up the user is their email
    // #################################################################

    if (!user) {
      // Create user
      const newUser = db
        .insert(users)
        .values({
          email: loginForm.data.email.toLowerCase(),
          emailVerified: 0,
        })
        .returning()
        .get();

      const code = await generateVerificationCodeForUserId(newUser.id);

      const html = render({
        template: SignUpTemplate,
        props: {
          code,
        },
      });
      const text = render({
        template: SignUpTemplate,
        props: {
          code,
        },
        options: {
          plainText: true,
        },
      });

      try {
        await emailSender.sendMail({
          from: MAIL_FROM_ADDRESS,
          to: loginForm.data.email.toLowerCase(),
          subject: `🚀 Code to sign up into ${PUBLIC_PROJECT_NAME}`,
          text,
          html,
        });
      } catch (e) {
        console.error(e);

        setFlash(
          {
            type: 'error',
            message: `Oups! Sorry, there was an error sending the email.`,
          },
          event
        );
        return fail(400, { loginForm });
      }

      // If you want to redirect to a signup form:
      redirect(302, '/login/code');
    }

    // #################################################################
    // # User exists! (Prepare templates, code, and send email)
    // #################################################################

    const code = await generateVerificationCodeForUserId(user.id);

    // Prepare sign in template to send
    const html = render({
      template: SignInTemplate,
      props: {
        code,
        username: user.username ?? 'Unknown',
      },
    });
    const text = render({
      template: SignInTemplate,
      props: {
        code,
        username: user.username ?? 'Unknown',
      },
      options: {
        plainText: true,
      },
    });

    try {
      await emailSender.sendMail({
        from: MAIL_FROM_ADDRESS,
        to: loginForm.data.email.toLowerCase(),
        subject: `✨ Code to login into ${PUBLIC_PROJECT_NAME}`,
        text,
        html,
      });
    } catch (e) {
      console.error(e);

      setFlash(
        {
          type: 'error',
          message: `Oups! Sorry, there was an error sending the email.`,
        },
        event
      );
      return fail(400, { loginForm });
    }

    redirect(302, '/login/code');
  },
};
