import { test, expect } from '../../base/api.fixture';
import { Severity } from 'allure-js-commons';
import { setSeverityAndTags } from '../../base/allureUtils.js';
import { API_ROUTES, DEFAULT_USER_PASSWORD } from '../../base/constants';
import { withAuth } from '../../base/http';
import { createUser, parseResponseBody } from '../../base/apiHelpers';
import { randomEmail, randomProduct } from '../../utils/fakerUtils';
import { readCsvColumn } from '../../utils/dataUtils';

test.describe.configure({ mode: 'parallel' });



test.describe('Login - ServeRest API', () => {
  test('CT01 - Perform login with valid credentials and validate token', async ({ api }) => {
    await setSeverityAndTags(Severity.CRITICAL, ['api', 'login', 'happy-path']);
    const email = randomEmail();
    const password = DEFAULT_USER_PASSWORD;

    const createResp = await createUser(api, { email, password });
    expect(createResp.status()).toBe(201);

    const loginResp = await api.post(API_ROUTES.LOGIN, { data: { email, password } });
    expect(loginResp.status()).toBe(200);

    const body = await parseResponseBody<{ message: string; authorization: string }>(loginResp);
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toBeTruthy();
  });

  test('CT02 - Attempt login with invalid credentials', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'login', 'negative']);
    const resp = await api.post(API_ROUTES.LOGIN, {
      data: {
        email: 'usuario@inexistente.com',
        password: 'senhaerrada'
      }
    });

    expect(resp.status()).toBe(401);

    const body = await parseResponseBody<{ message: string; authorization?: string }>(resp);
    expect(body.message).toBe('Email e/ou senha inválidos');
    expect(body.authorization).toBeUndefined();
  });

  test('CT03 - Validate required fields on login', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'login', 'validation']);
    const resp1 = await api.post(API_ROUTES.LOGIN, { data: { email: '', password: 'senha123' } });
    expect(resp1.status()).toBe(400);
    const body1 = await parseResponseBody<Record<string, string>>(resp1);
    expect(body1.email).toBeTruthy();

    const resp2 = await api.post(API_ROUTES.LOGIN, { data: { email: 'test@email.com', password: '' } });
    expect(resp2.status()).toBe(400);
    const body2 = await parseResponseBody<Record<string, string>>(resp2);
    expect(body2.password).toBeTruthy();

    const resp3 = await api.post(API_ROUTES.LOGIN, { data: { email: '', password: '' } });
    expect(resp3.status()).toBe(400);
    const body3 = await parseResponseBody<Record<string, string>>(resp3);
    expect(body3.email).toBeTruthy();
    expect(body3.password).toBeTruthy();
  });

  test('CT04 - Login and use token to access a protected resource', async ({ api }) => {
    await setSeverityAndTags(Severity.CRITICAL, ['api', 'login', 'authorization']);
    const userEmail = randomEmail();
    const userPassword = DEFAULT_USER_PASSWORD;

    const createResp = await createUser(api, { email: userEmail, password: userPassword });
    expect(createResp.status()).toBe(201);

    const loginResp = await api.post(API_ROUTES.LOGIN, { data: { email: userEmail, password: userPassword } });
    expect(loginResp.status()).toBe(200);

    const loginBody = await parseResponseBody<{ message: string; authorization: string }>(loginResp);
    expect(loginBody.message).toBe('Login realizado com sucesso');

    const productResp = await api.post(API_ROUTES.PRODUCTS, {
      headers: withAuth(loginBody.authorization),
      data: {
        nome: `${randomProduct()} ${Date.now()}`,
        preco: 100,
        descricao: 'Product generated for auth test',
        quantidade: 10
      }
    });

    expect(productResp.status()).toBe(403);
    const productBody = await parseResponseBody<{ message: string }>(productResp);
    expect(productBody.message).toBe('Rota exclusiva para administradores');
  });

  const invalidEmails = readCsvColumn('playwright_serverest', 'login', 'invalid-login-emails.csv');

  for (const invalidEmail of invalidEmails) {
    test(`CT05 - Validate invalid email format: ${invalidEmail}`, async ({ api }) => {
      await setSeverityAndTags(Severity.MINOR, ['api', 'login', 'validation']);
      const resp = await api.post(API_ROUTES.LOGIN, {
        data: {
          email: invalidEmail,
          password: 'senha123'
        }
      });

      expect(resp.status()).toBe(400);
      const body = await parseResponseBody<Record<string, string>>(resp);
      expect(body.email).toBeTruthy();
    });
  }
});
