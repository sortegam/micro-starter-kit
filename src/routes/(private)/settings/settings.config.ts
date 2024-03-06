import IconProfile from '~icons/tabler/user';
import IconAccount from '~icons/tabler/settings';
import IconAppearance from '~icons/tabler/color-filter';
import IconBilling from '~icons/tabler/wallet';
import type { ComponentType } from 'svelte';

// #################################################################
// # Setup the settings items
// #################################################################

export const settingsItems: Array<{
  title: string;
  path: string;
  icon?: ComponentType;
}> = [
  {
    title: 'Profile',
    path: '/settings/profile/',
    icon: IconProfile,
  },
  {
    title: 'Account',
    path: '/settings/account/',
    icon: IconAccount,
  },
  {
    title: 'Appearance',
    path: '/settings/appearance/',
    icon: IconAppearance,
  },
  {
    title: 'Billing',
    path: '/settings/billing/',
    icon: IconBilling,
  },
];

// #################################################################
// # Setup the settings keys whitelist for the API
// #################################################################

export const settingsKeysWhitelist = ['appearanceDarkTheme'];
