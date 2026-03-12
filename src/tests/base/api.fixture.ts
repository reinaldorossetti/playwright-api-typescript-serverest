import { test as base, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

import { env } from './env';

export const BASE_URL = env.apiBaseUrl;

type ApiFixtures = {
  api: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });

    await use(api);
    await api.dispose();
  }
});

export { expect };
