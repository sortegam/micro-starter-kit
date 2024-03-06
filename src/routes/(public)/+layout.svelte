<script lang="ts">
  // We need to load this on every page to make sure the Stripe JS is loaded
  // and can detect weird behaviors and frauds.
  // More info: https://github.com/stripe/stripe-js#ensuring-stripejs-is-available-everywhere
  import '@stripe/stripe-js';
  import { Logo } from '$lib/components/Logo';
  import Label from '$lib/components/ui/label/label.svelte';
  import { toImageUrl } from '$lib/utils/toImageUrl';
  import ImgBgLanding from '$lib/images/bg1-landing.png?format=webp&imagetools';
  import { version } from '$app/environment';
  import { PUBLIC_PROJECT_NAME } from '$env/static/public';
</script>

<main class="flex justify-center items-center h-screen">
  <div
    class="flex-1 flex flex-col text-center p-8 bg-no-repeat h-full bg-cover items-center
  justify-center"
    style="background-image: {toImageUrl(ImgBgLanding)}"
  >
    <div class="mb-10">
      <Logo />
    </div>

    <div class="flex-0">
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        SvelteKit
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        TailwindCSS
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Shadcn-svelte
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Image Optimization (vite-imagetools)
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Eslint
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Prettier
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Nodemailer
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        AWS SES / Custom SMTP transports
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Iconify
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Lucia Auth (Integrated: Google / Discord)
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Magic Link Auth
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Drizzle-Orm with Sqlite3
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        RateLimiter
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Svelte-email (Email templating)
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Flash Messages / Toasts
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Forms with Superforms.rocks
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Valibot (Schema validator)
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Stripe integration
      </div>
      <div
        class="inline-block text-sm text-gray-400 bg-black bg-opacity-70 py-1 px-2 m-1 border rounded-md border-gray-800"
      >
        Sentry integration
      </div>
    </div>
  </div>

  <div
    class="border-r-secondary border-r absolute left-50% h-full md:block hidden"
  ></div>
  <div class="flex-1 p-8">
    <div class="max-w-sm mx-auto">
      <div class="mb-8 text-center">
        <h1
          class="block text-2xl font-semibold mt-5 text-transparent bg-clip-text
        bg-gradient-to-r from-pink-700 to-yellow-200 animate-text-slow"
        >
          {PUBLIC_PROJECT_NAME}
        </h1>
      </div>

      <slot />

      <Label class="block mt-10 text-center">
        built with 💖 by
        <a class="text-orange-300" href="https://x.com/sortegam">@sortegam</a>
      </Label>
      <Label class="block mt-2 text-center text-xs">
        Release {version}
      </Label>
    </div>
  </div>
</main>
