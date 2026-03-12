import { config } from 'dotenv';

config();

const FALLBACK_PASSWORD = 'SenhaSegura@123';
const FALLBACK_BASE_URL = 'https://serverest.dev';

export const env = {
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD ?? FALLBACK_PASSWORD,
  apiBaseUrl: process.env.API_BASE_URL ?? FALLBACK_BASE_URL
} as const;
