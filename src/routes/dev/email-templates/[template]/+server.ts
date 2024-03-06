import { error, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import { render } from 'svelte-email';

export const GET: RequestHandler = async ({ params }) => {
  // Capture query string
  const templateId = params.template;
  const templateFound = fs
    .readdirSync('./src/lib/email-templates')
    .filter((item) => item.includes('.svelte'))
    .find((t) => t === templateId)
    ?.replace('.svelte', '');

  if (!templateFound) error(404);

  // We need to import the template dynamically and use relative path
  const template = (
    await import(`../../../../lib/email-templates/${templateFound}.svelte`)
  ).default;

  const html = render({ template });

  return new Response(html, { headers: { 'content-type': 'text/html' } });
};
