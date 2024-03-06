import type { settingsKeysWhitelist } from '$routes/(private)/settings/settings.config';

export type SaveSettingsParams = {
  [K in (typeof settingsKeysWhitelist)[number]]?: string | number | boolean;
};

/**
 * Global client helper to save user settings
 */

export const saveUserSettings = async (settings: SaveSettingsParams) => {
  const response = await fetch('/settings/api', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error('Failed to save settings');
  }
};
