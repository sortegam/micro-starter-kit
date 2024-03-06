import { fail, type Actions, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { profileSchema } from './profile.schema';
import type { PageServerLoad } from './$types';
import { valibot } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
  const { user } = event.locals;

  if (!user?.id) {
    return redirect(302, '/login');
  }

  const profileForm = await superValidate(
    {
      username: user?.username ?? '',
      email: user?.email ?? '',
    },
    valibot(profileSchema)
  );

  return {
    profileForm,
  };
};

export const actions: Actions = {
  default: async (event) => {
    // Use superValidate in form actions too, but with the request
    const profileForm = await superValidate(
      event.request,
      valibot(profileSchema)
    );

    setFlash(
      {
        type: 'error',
        message: `Sorry. At the moment we don't allow to change profile data. Delete and create a new account instead.`,
      },
      event
    );
    return fail(400, { profileForm });

    // Convenient validation check:
    if (!profileForm.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { profileForm });
    }

    return { profileForm };
  },
};
