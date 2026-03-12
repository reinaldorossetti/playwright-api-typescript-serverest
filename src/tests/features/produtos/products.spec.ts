import { test, expect } from '../../base/api.fixture';
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
  test('CT01 - List all products and validate JSON structure', async ({ api }) => {
    const resp = await api.get('/produtos');
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

  test('CT02 - Create a new product as an administrator', async ({ api }) => {
    const token = await createAdminAndGetToken(api);
    const productName = `Product ${Date.now()}`;

    const createResp = await api.post('/produtos', {
      headers: { Authorization: token },
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

    const getResp = await api.get(`/produtos/${createBody._id}`);
    expect(getResp.status()).toBe(200);

    const product = await parseResponseBody<Product>(getResp);
    expect(product.nome).toBe(productName);
    expect(product.preco).toBe(250);
    expect(product.quantidade).toBe(100);
  });

  test('CT03 - Validate error when creating a product with a duplicate name', async ({ api }) => {
    const token = await createAdminAndGetToken(api);
    const name = `Duplicate Product Test ${Date.now()}`;

    const payload = {
      nome: name,
      preco: 150,
      descricao: 'First product',
      quantidade: 50
    };

    const first = await api.post('/produtos', { headers: { Authorization: token }, data: payload });
    expect(first.status()).toBe(201);

    const second = await api.post('/produtos', { headers: { Authorization: token }, data: payload });
    expect(second.status()).toBe(400);

    const secondBody = await parseResponseBody<{ message: string }>(second);
    expect(secondBody.message).toBe('Já existe produto com esse nome');
  });

  test('CT04 - Search for products using query parameters', async ({ api }) => {
    const resp = await api.get('/produtos?nome=Logitech');
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ produtos: Product[] }>(resp);
    if (body.produtos?.length) {
      for (const p of body.produtos) {
        expect(p.nome).toContain('Logitech');
      }
    }

    const priceResp = await api.get('/produtos?preco=100');
    expect(priceResp.status()).toBe(200);
  });

  test('CT05 - Update information of an existing product', async ({ api }) => {
    const token = await createAdminAndGetToken(api);
    const productName = `Product ${Date.now()}`;

    const createResp = await api.post('/produtos', {
      headers: { Authorization: token },
      data: {
        nome: productName,
        preco: 100,
        descricao: 'Original description',
        quantidade: 50
      }
    });
    expect(createResp.status()).toBe(201);

    const createBody = await parseResponseBody<{ _id: string }>(createResp);

    const updateResp = await api.put(`/produtos/${createBody._id}`, {
      headers: { Authorization: token },
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

    const getResp = await api.get(`/produtos/${createBody._id}`);
    expect(getResp.status()).toBe(200);

    const product = await parseResponseBody<Product>(getResp);
    expect(product.preco).toBe(200);
    expect(product.descricao).toBe('Updated description');
    expect(product.quantidade).toBe(75);
  });

  test('CT06 - Validate price calculations and comparisons', async ({ api }) => {
    const resp = await api.get('/produtos');
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

  test('CT07 - Attempt to create a product without an authentication token', async ({ api }) => {
    const resp = await api.post('/produtos', {
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
    test(`CT08 - Validate required fields when creating a product [case ${i + 1}]`, async ({ api }) => {
      const token = await createAdminAndGetToken(api);
      const resp = await api.post('/produtos', {
        headers: { Authorization: token },
        data: missingFieldPayloads[i]
      });

      expect(resp.status()).toBe(400);
    });
  }

  test('CT09 - Work with complex JSON data', async ({ api }) => {
    const resp = await api.get('/produtos');
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

  test('CT10 - Delete an existing product', async ({ api }) => {
    const token = await createAdminAndGetToken(api);
    const productId = await createProduct(api, token, {
      price: 100,
      quantity: 10,
      description: 'Product to delete',
      name: `Product ${Date.now()}`
    });

    const deleteResp = await api.delete(`/produtos/${productId}`, { headers: { Authorization: token } });
    expect(deleteResp.status()).toBe(200);

    const deleteBody = await parseResponseBody<{ message: string }>(deleteResp);
    expect(deleteBody.message).toBe('Registro excluído com sucesso');

    const getResp = await api.get(`/produtos/${productId}`);
    expect(getResp.status()).toBe(400);
    const getBody = await parseResponseBody<{ message: string }>(getResp);
    expect(getBody.message).toBe('Produto não encontrado');
  });

  test('CT11 - Create a product from fixed JSON payload', async ({ api }) => {
    const token = await createAdminAndGetToken(api);

    const payload = loadJsonResource<Record<string, unknown>>(
      'playwright_serverest',
      'produtos',
      'resources',
      'productPayload.json'
    );
    payload.nome = `Product ${Date.now()}`;

    const resp = await api.post('/produtos', {
      headers: { Authorization: token },
      data: payload
    });

    expect(resp.status()).toBe(201);
    const body = await parseResponseBody<{ message: string; _id: string }>(resp);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();
  });

  test('CT12 - Prevent deleting a product that is part of a cart', async ({ api }) => {
    const adminToken = await createAdminAndGetToken(api);

    const createProductResp = await api.post('/produtos', {
      headers: { Authorization: adminToken },
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
    const userPassword = 'SenhaSegura@123';

    await createUser(api, userEmail, userPassword, false, 'Cart User');
    const userToken = await loginAndGetToken(api, userEmail, userPassword);

    await api.delete('/carrinhos/cancelar-compra', { headers: { Authorization: userToken } });

    const cartResp = await api.post('/carrinhos', {
      headers: { Authorization: userToken },
      data: {
        produtos: [{ idProduto: createProductBody._id, quantidade: 1 }]
      }
    });
    expect(cartResp.status()).toBe(201);

    const deleteResp = await api.delete(`/produtos/${createProductBody._id}`, {
      headers: { Authorization: adminToken }
    });
    expect(deleteResp.status()).toBe(400);

    const deleteBody = await parseResponseBody<{ message: string }>(deleteResp);
    expect(deleteBody.message).toBe('Não é permitido excluir produto que faz parte de carrinho');
  });

  test('CT13 - Restrict product creation to administrators only', async ({ api }) => {
    const userEmail = `non.admin.${Date.now()}@example.com`;
    const userPassword = 'SenhaSegura@123';

    await createUser(api, userEmail, userPassword, false, 'Non Admin User');
    const nonAdminToken = await loginAndGetToken(api, userEmail, userPassword);

    const productResp = await api.post('/produtos', {
      headers: { Authorization: nonAdminToken },
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
