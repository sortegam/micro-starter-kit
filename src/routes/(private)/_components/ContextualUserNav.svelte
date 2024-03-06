<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Avatar from '$lib/components/ui/avatar';
  import { Button } from '$lib/components/Button';
  import { goto } from '$app/navigation';
  import { user } from '$lib/client/stores/userStore';
  import { settingsItems } from '../settings/settings.config';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      class="relative h-8 w-8 rounded-full"
    >
      <Avatar.Root class="h-8 w-8">
        <Avatar.Image src="https://i.pravatar.cc/50?u=XSK" alt="XSK" />
        <Avatar.Fallback>SC</Avatar.Fallback>
      </Avatar.Root>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Label class="font-normal">
      <div class="flex flex-col space-y-1">
        <p class="text-sm font-medium leading-none">{$user?.username}</p>
        <p class="text-xs leading-none text-muted-foreground">{$user?.email}</p>
      </div>
    </DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      {#each settingsItems as item}
        <DropdownMenu.Item
          on:click={() => {
            goto(item.path);
          }}
        >
          <svelte:component this={item.icon} class="mr-2" />
          {item.title}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      on:click={() => {
        goto('/logout');
      }}
    >
      Log out
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
