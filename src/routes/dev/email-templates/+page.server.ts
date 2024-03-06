import fs from 'fs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const templateList = fs
    .readdirSync('./src/lib/email-templates')
    .filter((item) => item.includes('.svelte'));
  return { templateList };
};
