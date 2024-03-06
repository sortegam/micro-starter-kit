import { loadFlash } from 'sveltekit-flash-message/server';

export const trailingSlash = 'always';

export const load = loadFlash(async () => {
  // No data atm
  const data = {};
  return data;
});
