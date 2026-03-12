import { test, expect } from '../../base/api.fixture';
import { annotateTest } from '../../base/allure';
import { API_ROUTES, DEFAULT_USER_PASSWORD } from '../../base/constants';
import { withAuth } from '../../base/http';
import { createAdminAndGetToken, createProduct, createUser, loginAndGetToken, parseResponseBody } from '../../base/apiHelpers';
import { loadJsonResource } from '../../utils/dataUtils';

test.describe.configure({ mode: 'parallel' });

type Product = {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
};

test.describe('Produtos - ServeRest API', () => {
  test('CT01 - List all products and validate JSON structure', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'normal', tags: ['api', 'produtos', 'listing'] });
    const resp = await api.get(API_ROUTES.PRODUCTS);
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ quantidade: number; produtos: Product[] }>(resp);
    expect(body.quantidade).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(body.produtos)).toBeTruthy();

    for (const p of body.produtos) {
      expect(p).toHaveProperty('nome');
      expect(p).toHaveProperty('preco');
      expect(p).toHaveProperty('descricao');
      expect(p).toHaveProperty('quantidade');
      expect(p).toHaveProperty('_id');
    }
  });

  test('CT02 - Create a new product as an administrator', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'critical', tags: ['api', 'produtos', 'creation'] });
    const token = await createAdminAndGetToken(api);
    const productName = `Product ${Date.now()}`;

    const createResp = await api.post(API_ROUTES.PRODUCTS, {
      headers: withAuth(token),
      data: {
        nome: productName,
        preco: 250,
        descricao: 'Automated test product',
        quantidade: 100
      }
    });

    expect(createResp.status()).toBe(201);

    const createBody = await parseResponseBody<{ message: string; _id: string }>(createResp);
    expect(createBody.message).toBe('Cadastro realizado com sucesso');
    expect(createBody._id).toBeTruthy();

    const getResp = await api.get(`${API_ROUTES.PRODUCTS}/${createBody._id}`);
    expect(getResp.status()).toBe(200);

    const product = await parseResponseBody<Product>(getResp);
    expect(product.nome).toBe(productName);
    expect(product.preco).toBe(250);
    expect(product.quantidade).toBe(100);
  });

  test('CT03 - Validate error when creating a product with a duplicate name', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'normal', tags: ['api', 'produtos', 'validation'] });
    const token = await createAdminAndGetToken(api);
    const name = `Duplicate Product Test ${Date.now()}`;

    const payload = {
      nome: name,
      preco: 150,
      descricao: 'First product',
      quantidade: 50
    };

    const first = await api.post(API_ROUTES.PRODUCTS, { headers: withAuth(token), data: payload });
    expect(first.status()).toBe(201);

    const second = await api.post(API_ROUTES.PRODUCTS, { headers: withAuth(token), data: payload });
    expect(second.status()).toBe(400);

    const secondBody = await parseResponseBody<{ message: string }>(second);
    expect(secondBody.message).toBe('Já existe produto com esse nome');
  });

  test('CT04 - Search for products using query parameters', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'minor', tags: ['api', 'produtos', 'filters'] });
    const resp = await api.get(`${API_ROUTES.PRODUCTS}?nome=Logitech`);
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ produtos: Product[] }>(resp);
    if (body.produtos?.length) {
      for (const p of body.produtos) {
        expect(p.nome).toContain('Logitech');
      }
    }

    const priceResp = await api.get(`${API_ROUTES.PRODUCTS}?preco=100`);
    expect(priceResp.status()).toBe(200);
  });

  test('CT05 - Update information of an existing product', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'critical', tags: ['api', 'produtos', 'update'] });
    const token = await createAdminAndGetToken(api);
    const productName = `Product ${Date.now()}`;

    const createResp = await api.post(API_ROUTES.PRODUCTS, {
      headers: withAuth(token),
      data: {
        nome: productName,
        preco: 100,
        descricao: 'Original description',
        quantidade: 50
      }
    });
    expect(createResp.status()).toBe(201);

    const createBody = await parseResponseBody<{ _id: string }>(createResp);

    const updateResp = await api.put(`${API_ROUTES.PRODUCTS}/${createBody._id}`, {
      headers: withAuth(token),
      data: {
        nome: productName,
        preco: 200,
        descricao: 'Updated description',
        quantidade: 75
      }
    });
    expect(updateResp.status()).toBe(200);

    const updateBody = await parseResponseBody<{ message: string }>(updateResp);
    expect(updateBody.message).toBe('Registro alterado com sucesso');

    const getResp = await api.get(`${API_ROUTES.PRODUCTS}/${createBody._id}`);
    expect(getResp.status()).toBe(200);

    const product = await parseResponseBody<Product>(getResp);
    expect(product.preco).toBe(200);
    expect(product.descricao).toBe('Updated description');
    expect(product.quantidade).toBe(75);
  });

  test('CT06 - Validate price calculations and comparisons', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'minor', tags: ['api', 'produtos', 'analytics'] });
    const resp = await api.get(API_ROUTES.PRODUCTS);
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ produtos: Product[] }>(resp);
    if (!body.produtos?.length) {
      return;
    }

    const prices = body.produtos.map((p) => Number(p.preco));
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
      expect(price).toBeLessThan(100000);
    }

    expect(maxPrice).toBeGreaterThanOrEqual(minPrice);
  });

  test('CT07 - Attempt to create a product without an authentication token', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'normal', tags: ['api', 'produtos', 'auth'] });
    const resp = await api.post(API_ROUTES.PRODUCTS, {
      data: {
        nome: 'Product Without Auth',
        preco: 100,
        descricao: 'Test',
        quantidade: 10
      }
    });

    expect(resp.status()).toBe(401);
    const body = await parseResponseBody<{ message: string }>(resp);
    expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });

  const missingFieldPayloads = [
    { preco: 0.55, descricao: 'Test without name', quantidade: 10 },
    { nome: 'Product Without Description', descricao: '', quantidade: 10 },
    { nome: 'Product Without Quantity', preco: 100, quantidade: -1 },
    { nome: 'null', preco: 1.99, descricao: 'null' }
  ];

  for (let i = 0; i < missingFieldPayloads.length; i++) {
    test(`CT08 - Validate required fields when creating a product [case ${i + 1}]`, async ({ api }, testInfo) => {
      annotateTest(testInfo, { severity: 'normal', tags: ['api', 'produtos', 'validation'] });
      const token = await createAdminAndGetToken(api);
      const resp = await api.post(API_ROUTES.PRODUCTS, {
        headers: withAuth(token),
        data: missingFieldPayloads[i]
      });

      expect(resp.status()).toBe(400);
    });
  }

  test('CT09 - Work with complex JSON data', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'minor', tags: ['api', 'produtos', 'analytics'] });
    const resp = await api.get(API_ROUTES.PRODUCTS);
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ produtos: Product[] }>(resp);
    if (!body.produtos) {
      return;
    }

    const cheapProducts = body.produtos.filter((p) => Number(p.preco) < 100);
    const mediumProducts = body.produtos.filter((p) => Number(p.preco) >= 100 && Number(p.preco) < 500);
    const expensiveProducts = body.produtos.filter((p) => Number(p.preco) >= 500);

    expect(cheapProducts).toBeDefined();
    expect(mediumProducts).toBeDefined();
    expect(expensiveProducts).toBeDefined();
  });

  test('CT10 - Delete an existing product', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'critical', tags: ['api', 'produtos', 'deletion'] });
    const token = await createAdminAndGetToken(api);
    const productId = await createProduct(api, token, {
      price: 100,
      quantity: 10,
      description: 'Product to delete',
      name: `Product ${Date.now()}`
    });

    const deleteResp = await api.delete(`${API_ROUTES.PRODUCTS}/${productId}`, { headers: withAuth(token) });
    expect(deleteResp.status()).toBe(200);

    const deleteBody = await parseResponseBody<{ message: string }>(deleteResp);
    expect(deleteBody.message).toBe('Registro excluído com sucesso');

    const getResp = await api.get(`${API_ROUTES.PRODUCTS}/${productId}`);
    expect(getResp.status()).toBe(400);
    const getBody = await parseResponseBody<{ message: string }>(getResp);
    expect(getBody.message).toBe('Produto não encontrado');
  });

  test('CT11 - Create a product from fixed JSON payload', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'normal', tags: ['api', 'produtos', 'data-driven'] });
    const token = await createAdminAndGetToken(api);

    const payload = loadJsonResource<Record<string, unknown>>(
      'playwright_serverest',
      'produtos',
      'resources',
      'productPayload.json'
    );
    payload.nome = `Product ${Date.now()}`;

    const resp = await api.post(API_ROUTES.PRODUCTS, {
      headers: withAuth(token),
      data: payload
    });

    expect(resp.status()).toBe(201);
    const body = await parseResponseBody<{ message: string; _id: string }>(resp);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();
  });

  test('CT12 - Prevent deleting a product that is part of a cart', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'critical', tags: ['api', 'produtos', 'carrinhos'] });
    const adminToken = await createAdminAndGetToken(api);

    const createProductResp = await api.post(API_ROUTES.PRODUCTS, {
      headers: withAuth(adminToken),
      data: {
        nome: `Product ${Date.now()}`,
        preco: 300,
        descricao: 'Product linked to cart',
        quantidade: 10
      }
    });
    expect(createProductResp.status()).toBe(201);

    const createProductBody = await parseResponseBody<{ _id: string }>(createProductResp);

    const userEmail = `cart.user.${Date.now()}@example.com`;
    const userPassword = DEFAULT_USER_PASSWORD;

    await createUser(api, { email: userEmail, password: userPassword, name: 'Cart User' });
    const userToken = await loginAndGetToken(api, userEmail, userPassword);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(userToken) });

    const cartResp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(userToken),
      data: {
        produtos: [{ idProduto: createProductBody._id, quantidade: 1 }]
      }
    });
    expect(cartResp.status()).toBe(201);

    const deleteResp = await api.delete(`${API_ROUTES.PRODUCTS}/${createProductBody._id}`, {
      headers: withAuth(adminToken)
    });
    expect(deleteResp.status()).toBe(400);

    const deleteBody = await parseResponseBody<{ message: string }>(deleteResp);
    expect(deleteBody.message).toBe('Não é permitido excluir produto que faz parte de carrinho');
  });

  test('CT13 - Restrict product creation to administrators only', async ({ api }, testInfo) => {
    annotateTest(testInfo, { severity: 'normal', tags: ['api', 'produtos', 'authorization'] });
    const userEmail = `non.admin.${Date.now()}@example.com`;
    const userPassword = DEFAULT_USER_PASSWORD;

    await createUser(api, { email: userEmail, password: userPassword, name: 'Non Admin User' });
    const nonAdminToken = await loginAndGetToken(api, userEmail, userPassword);

    const productResp = await api.post(API_ROUTES.PRODUCTS, {
      headers: withAuth(nonAdminToken),
      data: {
        nome: 'Restricted Product',
        preco: 500,
        descricao: 'Product should be created only by admins',
        quantidade: 5
      }
    });

    expect(productResp.status()).toBe(403);
    const body = await parseResponseBody<{ message: string }>(productResp);
    expect(body.message).toBe('Rota exclusiva para administradores');
  });
});
