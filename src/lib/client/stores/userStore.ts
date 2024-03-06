import { writable } from 'svelte/store';

export const user = writable<App.Locals['user'] | null>(null);
