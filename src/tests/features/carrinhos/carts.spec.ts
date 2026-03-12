import { test, expect } from '../../base/api.fixture';
import type { APIRequestContext } from '@playwright/test';
import { allure } from 'allure-playwright';
import { Severity } from 'allure-js-commons';
import { API_ROUTES, DEFAULT_USER_PASSWORD } from '../../base/constants';
import { withAuth } from '../../base/http';
import { createProduct, createUser, loginAndGetToken, parseResponseBody } from '../../base/apiHelpers';
import { randomEmail } from '../../utils/fakerUtils';

test.describe.configure({ mode: 'parallel' });

const setSeverityAndTags = async (severity: Severity, tags: string[] = []): Promise<void> => {
  await allure.severity(severity);
  for (const tag of tags) {
    await allure.tag(tag);
  }
};

async function loginWithDefaultPayload(api: APIRequestContext): Promise<string> {
  const userEmail = randomEmail();
  const userPassword = DEFAULT_USER_PASSWORD;

  await createUser(api, { email: userEmail, password: userPassword, admin: true, name: 'Cart Default User' });
  return loginAndGetToken(api, userEmail, userPassword);
}

async function createAdminUserAndGetToken(api: APIRequestContext): Promise<string> {
  const userEmail = randomEmail();
  const userPassword = DEFAULT_USER_PASSWORD;

  await createUser(api, { email: userEmail, password: userPassword, admin: true, name: 'Cart User' });
  return loginAndGetToken(api, userEmail, userPassword);
}

test.describe('Carrinhos - ServeRest API', () => {
  test('CT01 - Full cart lifecycle for authenticated user', async ({ api }) => {
    await setSeverityAndTags(Severity.CRITICAL, ['api', 'carrinhos', 'lifecycle']);
    const token = await createAdminUserAndGetToken(api);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(token) });

    const productId = await createProduct(api, token, {
      price: 150,
      quantity: 10,
      description: 'Product created for cart lifecycle test'
    });

    const createCartResp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(token),
      data: { produtos: [{ idProduto: productId, quantidade: 2 }] }
    });
    expect(createCartResp.status()).toBe(201);

    const createCartBody = await parseResponseBody<{ message: string; _id: string }>(createCartResp);
    expect(createCartBody.message).toBe('Cadastro realizado com sucesso');
    expect(createCartBody._id).toBeTruthy();

    const getCartResp = await api.get(`${API_ROUTES.CARTS}/${createCartBody._id}`);
    expect(getCartResp.status()).toBe(200);

    const getCartBody = await parseResponseBody<{
      produtos: unknown[];
      precoTotal: number;
      quantidadeTotal: number;
      idUsuario: string;
      _id: string;
    }>(getCartResp);

    expect(getCartBody.produtos.length).toBe(1);
    expect(getCartBody.precoTotal).toBeTruthy();
    expect(getCartBody.quantidadeTotal).toBeTruthy();
    expect(getCartBody.idUsuario).toBeTruthy();
    expect(getCartBody._id).toBe(createCartBody._id);

    const concludeResp = await api.delete(API_ROUTES.CART_CONCLUDE, { headers: withAuth(token) });
    expect(concludeResp.status()).toBe(200);

    const concludeBody = await parseResponseBody<{ message: string }>(concludeResp);
    expect(concludeBody.message).toContain('Registro excluído com sucesso');
  });

  test('CT02 - Cancel purchase and return products to stock', async ({ api }) => {
    await setSeverityAndTags(Severity.CRITICAL, ['api', 'carrinhos', 'stock']);
    const token = await loginWithDefaultPayload(api);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(token) });

    const productId = await createProduct(api, token, {
      price: 200,
      quantity: 5,
      description: 'Product for cancel purchase test'
    });

    const createCartResp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(token),
      data: { produtos: [{ idProduto: productId, quantidade: 1 }] }
    });
    expect(createCartResp.status()).toBe(201);

    const cancelResp = await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(token) });
    expect(cancelResp.status()).toBe(200);

    const cancelBody = await parseResponseBody<{ message: string }>(cancelResp);
    expect(cancelBody.message).toBeTruthy();
  });

  test('CT03 - Prevent creating cart without authentication token', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'carrinhos', 'auth']);
    const resp = await api.post(API_ROUTES.CARTS, {
      data: { produtos: [{ idProduto: 'BeeJh5lz3k6kSIzA', quantidade: 1 }] }
    });

    expect(resp.status()).toBe(401);

    const body = await parseResponseBody<{ message: string }>(resp);
    expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });

  test('CT04 - Prevent creating more than one cart for the same user', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'carrinhos', 'business-rule']);
    const token = await loginWithDefaultPayload(api);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(token) });

    const productId = await createProduct(api, token, {
      price: 120,
      quantity: 3,
      description: 'Product for multiple cart test'
    });

    const firstResp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(token),
      data: { produtos: [{ idProduto: productId, quantidade: 1 }] }
    });
    expect(firstResp.status()).toBe(201);

    const secondResp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(token),
      data: { produtos: [{ idProduto: productId, quantidade: 1 }] }
    });
    expect(secondResp.status()).toBe(400);

    const secondBody = await parseResponseBody<{ message: string }>(secondResp);
    expect(secondBody.message).toContain('Não é permitido ter mais de 1 carrinho');
  });

  test('CT05 - Cart not found by ID', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'carrinhos', 'error-handling']);
    const resp = await api.get(`${API_ROUTES.CARTS}/invalid-cart-id-123`);
    expect(resp.status()).toBe(400);

    const body = await parseResponseBody<{ id: string }>(resp);
    expect(body.id).toBe('id deve ter exatamente 16 caracteres alfanuméricos');
  });

  test('CT06 - Prevent cart creation when product stock is insufficient', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'carrinhos', 'stock']);
    const token = await loginWithDefaultPayload(api);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(token) });

    const productId = await createProduct(api, token, {
      price: 100,
      quantity: 1,
      description: 'Low stock product for cart test'
    });

    const resp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(token),
      data: { produtos: [{ idProduto: productId, quantidade: 2 }] }
    });

    expect(resp.status()).toBe(400);
    const body = await parseResponseBody<{ message: string }>(resp);
    expect(body.message).toContain('Produto não possui quantidade suficiente');
  });

  test('CT07 - Prevent cart creation with duplicated products in the same cart', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'carrinhos', 'validation']);
    const token = await loginWithDefaultPayload(api);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(token) });

    const productId = await createProduct(api, token, {
      price: 150,
      quantity: 10,
      description: 'Product created for duplicated products cart test'
    });

    const resp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(token),
      data: {
        produtos: [
          { idProduto: productId, quantidade: 1 },
          { idProduto: productId, quantidade: 1 }
        ]
      }
    });

    expect(resp.status()).toBe(400);
    const body = await parseResponseBody<{ message: string }>(resp);
    expect(body.message).toContain('Não é permitido possuir produto duplicado');
  });

  test('CT08 - Prevent cart creation with non-existing product', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'carrinhos', 'data-integrity']);
    const token = await loginWithDefaultPayload(api);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(token) });

    const resp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(token),
      data: { produtos: [{ idProduto: 'AAAAAAAAAAAAAAAA', quantidade: 1 }] }
    });

    expect(resp.status()).toBe(400);
    const body = await parseResponseBody<{ message: string }>(resp);
    expect(body.message).toContain('Produto não encontrado');
  });
});
