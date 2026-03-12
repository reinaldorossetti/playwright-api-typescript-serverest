import type { APIRequestContext, APIResponse } from '@playwright/test';

import { API_ROUTES, DEFAULT_USER_PASSWORD } from './constants.js';
import { withAuth } from './http.js';
import { randomEmail, randomProduct } from '../utils/fakerUtils.js';

export async function parseResponseBody<T = Record<string, unknown>>(response: APIResponse): Promise<T> {
  return (await response.json()) as T;
}

export type CreateUserOptions = {
  email: string;
  password: string;
  admin?: boolean;
  name?: string;
};

export async function createUser(api: APIRequestContext, { email, password, admin = false, name }: CreateUserOptions): Promise<APIResponse> {
  const payload = {
    nome: name ?? email,
    email,
    password,
    administrador: admin ? 'true' : 'false'
  };

  return api.post(API_ROUTES.USERS, { data: payload });
}

export async function loginAndGetToken(
  api: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const loginResp = await api.post(API_ROUTES.LOGIN, { data: { email, password } });
  if (loginResp.status() !== 200) {
    throw new Error(`Login failed with status ${loginResp.status()}`);
  }
  const loginBody = await parseResponseBody<{ authorization: string }>(loginResp);
  return loginBody.authorization;
}

export async function createAdminAndGetToken(api: APIRequestContext): Promise<string> {
  const email = `admin.${randomEmail()}`;
  const password = DEFAULT_USER_PASSWORD;

  await createUser(api, { email, password, admin: true, name: 'Admin User' });
  return loginAndGetToken(api, email, password);
}

export async function createProduct(
  api: APIRequestContext,
  token: string,
  params?: { price?: number; quantity?: number; description?: string; name?: string }
): Promise<string> {
  const payload = {
    nome: params?.name ?? `${randomProduct()} ${Date.now()}`,
    preco: params?.price ?? 100,
    descricao: params?.description ?? 'Produto gerado para testes',
    quantidade: params?.quantity ?? 10
  };

  const resp = await api.post(API_ROUTES.PRODUCTS, {
    headers: withAuth(token),
    data: payload
  });

  if (resp.status() !== 201) {
    throw new Error(`Product creation failed with status ${resp.status()}`);
  }

  const body = await parseResponseBody<{ _id: string }>(resp);
  return body._id;
}
