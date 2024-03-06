<script lang="ts">
  import { Button } from '$lib/components/Button';
  import * as Card from '$lib/components/ui/card';
</script>

<Card.Root class="max-w-sm">
  <Card.Header class="space-y-1">
    <Card.Description>
      This is µStarter-Kit a tiny SaaS starter built with SvelteKit with a bunch
      of features ready to use.
      <br />
      <br />
      <b>Free for use and open source. MIT Licensed.</b>
    </Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="grid grid-cols-1 gap-6">
      <Button href="/login">Login / Register</Button>
    </div>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
    </div>
  </Card.Content>

  <Card.Footer>
    <p class="px-8 text-center text-sm text-muted-foreground">
      By clicking continue, you agree to our{' '}
      <a href="/terms" class="underline underline-offset-4 hover:text-primary">
        Terms of Service
      </a>
      {' '}
      and{' '}
      <a
        href="/privacy"
        class="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </a>
      .
    </p>
  </Card.Footer>
</Card.Root>
