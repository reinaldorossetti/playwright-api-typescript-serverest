import { test, expect } from '../../base/api.fixture';
import { Severity, severity, tag } from 'allure-js-commons';
import { API_ROUTES, DEFAULT_USER_PASSWORD } from '../../base/constants';
import { withAuth } from '../../base/http';
import { createUser, loginAndGetToken, parseResponseBody } from '../../base/apiHelpers';
import { loadJsonResource } from '../../utils/dataUtils';
import { randomEmail, randomName } from '../../utils/fakerUtils';

test.describe.configure({ mode: 'parallel' });

const setSeverityAndTags = async (sev: Severity, tags: string[] = []): Promise<void> => {
  await severity(sev);
  for (const t of tags) {
    await tag(t);
  }
};

type User = {
  _id: string;
  nome: string;
  email: string;
  password: string;
  administrador: string;
};

test.describe('Usuários - ServeRest API', () => {
  test('CT01 - List all users and validate JSON structure', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'usuarios', 'listing']);
    const resp = await api.get('/usuarios');
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ quantidade: number; usuarios: User[] }>(resp);
    expect(body.quantidade).toBeGreaterThan(0);
    expect(body.usuarios.length).toBeGreaterThan(0);

    for (const user of body.usuarios) {
      expect(user).toHaveProperty('nome');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('administrador');
      expect(user).toHaveProperty('_id');
      expect(user.email).toMatch(/.+@.+\..+/);
    }
  });

  test('CT02 - Get a specific user by ID', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'usuarios', 'details']);
    const listResp = await api.get('/usuarios');
    expect(listResp.status()).toBe(200);

    const listBody = await parseResponseBody<{ usuarios: User[] }>(listResp);
    const userId = listBody.usuarios[0]._id;

    const getResp = await api.get(`/usuarios/${userId}`);
    expect(getResp.status()).toBe(200);

    const user = await parseResponseBody<User>(getResp);
    expect(user._id).toBe(userId);
    expect(user.nome).toBeTruthy();
    expect(user.email).toBeTruthy();
  });

  test('CT03 - Create a new user with complete validations', async ({ api }) => {
    await setSeverityAndTags(Severity.CRITICAL, ['api', 'usuarios', 'creation']);
    const email = randomEmail();
    const nome = randomName();
    const password = 'Senha123@';

    const createResp = await api.post('/usuarios', {
      data: {
        nome,
        email,
        password,
        administrador: 'true'
      }
    });

    expect(createResp.status()).toBe(201);

    const createBody = await parseResponseBody<{ message: string; _id: string }>(createResp);
    expect(createBody.message).toBe('Cadastro realizado com sucesso');
    expect(createBody._id).toBeTruthy();

    const getResp = await api.get(`/usuarios/${createBody._id}`);
    expect(getResp.status()).toBe(200);

    const user = await parseResponseBody<User>(getResp);
    expect(user.nome).toBe(nome);
    expect(user.email).toBe(email);
  });

  test('CT04 - Advanced JSON validations with filters', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'usuarios', 'filters']);
    const resp = await api.get('/usuarios');
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ usuarios: User[] }>(resp);
    const admins = body.usuarios.filter((u) => u.administrador === 'true');

    expect(admins.length).toBeGreaterThan(0);

    for (const user of body.usuarios) {
      expect(user.email).toBeTruthy();
    }
  });

  test('CT05 - Validate error messages when creating a duplicate email', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'usuarios', 'validation']);
    const duplicateEmail = randomEmail();

    const first = await api.post('/usuarios', {
      data: {
        nome: 'User 1',
        email: duplicateEmail,
        password: 'senha123',
        administrador: 'false'
      }
    });
    expect(first.status()).toBe(201);

    const second = await api.post('/usuarios', {
      data: {
        nome: 'User 2',
        email: duplicateEmail,
        password: 'anotherpassword',
        administrador: 'true'
      }
    });

    expect(second.status()).toBe(400);
    const secondBody = await parseResponseBody<{ message: string }>(second);
    expect(secondBody.message).toBe('Este email já está sendo usado');
  });

  test('CT06 - Validate with fuzzy matching', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'usuarios', 'filters']);
    const resp = await api.get('/usuarios?administrador=true');
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ quantidade: number; usuarios: User[] }>(resp);
    expect(body.quantidade).toBeGreaterThanOrEqual(0);

    for (const user of body.usuarios) {
      expect(user.nome).toBeTruthy();
      expect(user.email).toBeTruthy();
      expect(String(user.administrador)).toBe('true');
    }
  });

  test('CT07 - Conditional validations based on values', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'usuarios', 'validation']);
    const resp = await api.get('/usuarios');
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ usuarios: User[] }>(resp);
    const user = body.usuarios[0];

    expect(['true', 'false']).toContain(String(user.administrador));
    expect(user.email.length).toBeGreaterThan(5);
    expect(user.password.length).toBeGreaterThan(0);
  });

  test('CT08 - Validate formats with regular expressions', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'usuarios', 'regex']);
    const newEmail = `test.regex.${Date.now()}@example.com`;

    const createResp = await api.post('/usuarios', {
      data: {
        nome: 'Regex Test',
        email: newEmail,
        password: 'StrongPassword@123',
        administrador: 'false'
      }
    });
    expect(createResp.status()).toBe(201);

    const createBody = await parseResponseBody<{ _id: string }>(createResp);
    const getResp = await api.get(`/usuarios/${createBody._id}`);
    expect(getResp.status()).toBe(200);

    const user = await parseResponseBody<User>(getResp);

    expect(user.email).toMatch(/.+@.+\..+/);
    expect(user.nome).toMatch(/[A-Za-z\s]+/);
    expect(user._id).toMatch(/[A-Za-z0-9]+/);
  });

  test('CT09 - Validate absence of fields', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'usuarios', 'validation']);
    const resp = await api.get('/usuarios');
    expect(resp.status()).toBe(200);

    const body = await parseResponseBody<{ error?: string; errorMessage?: string; usuarios: User[] }>(resp);
    expect(body.error).toBeUndefined();
    expect(body.errorMessage).toBeUndefined();

    const user = body.usuarios[0] as Record<string, unknown>;
    expect(user.cpf).toBeUndefined();
    expect(user.phone).toBeUndefined();
  });

  test('CT10 - Use variables for dynamic validations', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'usuarios', 'data-driven']);
    const expectedEmail = randomEmail();
    const userPayload = loadJsonResource<Record<string, unknown>>(
      'playwright_serverest',
      'usuarios',
      'resources',
      'userPayload.json'
    );
    userPayload.email = expectedEmail;

    const createResp = await api.post('/usuarios', { data: userPayload });
    expect(createResp.status()).toBe(201);

    const searchResp = await api.get(`/usuarios?email=${expectedEmail}`);
    expect(searchResp.status()).toBe(200);

    const searchBody = await parseResponseBody<{ usuarios: User[] }>(searchResp);
    expect(searchBody.usuarios.length).toBeGreaterThan(0);
    expect(searchBody.usuarios[0].email).toBe(expectedEmail);
    expect(searchBody.usuarios[0].nome).toBeTruthy();
  });

  test('CT11 - Prepare data for nested object validation', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'usuarios', 'validation']);
    const complexEmail = randomEmail();

    const resp = await api.post('/usuarios', {
      data: {
        nome: 'Complex User',
        email: complexEmail,
        password: 'senha123',
        administrador: 'true'
      }
    });

    expect(resp.status()).toBe(201);

    const body = await parseResponseBody<{ message: string; _id: string }>(resp);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();
    expect(body._id.length).toBeGreaterThan(10);
  });

  test('CT12 - Create a user from fixed JSON file', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'usuarios', 'data-driven']);
    const payload = loadJsonResource<Record<string, unknown>>(
      'playwright_serverest',
      'usuarios',
      'resources',
      'userPayload.json'
    );
    payload.email = randomEmail();

    const resp = await api.post('/usuarios', { data: payload });
    expect(resp.status()).toBe(201);

    const body = await parseResponseBody<{ message: string; _id: string }>(resp);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();
  });

  test('CT13 - Create and delete user based on JSON payload', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'usuarios', 'lifecycle']);
    const expectedEmail = randomEmail();
    const payload = loadJsonResource<Record<string, unknown>>(
      'playwright_serverest',
      'usuarios',
      'resources',
      'userPayload.json'
    );
    payload.email = expectedEmail;

    const createResp = await api.post('/usuarios', { data: payload });
    expect(createResp.status()).toBe(201);
    const createBody = await parseResponseBody<{ message: string; _id: string }>(createResp);
    expect(createBody.message).toBe('Cadastro realizado com sucesso');

    const deleteResp = await api.delete(`/usuarios/${createBody._id}`);
    expect(deleteResp.status()).toBe(200);
    const deleteBody = await parseResponseBody<{ message: string }>(deleteResp);
    expect(deleteBody.message).toBe('Registro excluído com sucesso');

    const searchResp = await api.get(`/usuarios?email=${expectedEmail}`);
    expect(searchResp.status()).toBe(200);
    const searchBody = await parseResponseBody<{ quantidade: number }>(searchResp);
    expect(searchBody.quantidade).toBe(0);
  });

  test('CT14 - Prevent deleting user that has an associated cart', async ({ api }) => {
    await setSeverityAndTags(Severity.CRITICAL, ['api', 'usuarios', 'carrinhos']);
    const userEmail = randomEmail();
    const userPassword = DEFAULT_USER_PASSWORD;

    const createUserResp = await createUser(api, { email: userEmail, password: userPassword, admin: true, name: 'User With Cart' });
    expect(createUserResp.status()).toBe(201);

    const createUserBody = await parseResponseBody<{ message: string; _id: string }>(createUserResp);
    expect(createUserBody.message).toBe('Cadastro realizado com sucesso');

    const userToken = await loginAndGetToken(api, userEmail, userPassword);

    const productResp = await api.post(API_ROUTES.PRODUCTS, {
      headers: withAuth(userToken),
      data: {
        nome: `Product for user cart ${Date.now()}`,
        preco: 100,
        descricao: 'Product associated to user cart',
        quantidade: 5
      }
    });
    expect(productResp.status()).toBe(201);

    const productBody = await parseResponseBody<{ _id: string }>(productResp);

    await api.delete(API_ROUTES.CART_CANCEL, { headers: withAuth(userToken) });

    const cartResp = await api.post(API_ROUTES.CARTS, {
      headers: withAuth(userToken),
      data: { produtos: [{ idProduto: productBody._id, quantidade: 1 }] }
    });
    expect(cartResp.status()).toBe(201);

    const deleteResp = await api.delete(`/usuarios/${createUserBody._id}`);
    expect(deleteResp.status()).toBe(400);

    const deleteBody = await parseResponseBody<{ message: string; idCarrinho: string }>(deleteResp);
    expect(deleteBody.message).toBe('Não é permitido excluir usuário com carrinho cadastrado');
    expect(deleteBody.idCarrinho).toBeTruthy();
  });

  test('CT15 - Get user by invalid ID should return 400', async ({ api }) => {
    await setSeverityAndTags(Severity.MINOR, ['api', 'usuarios', 'error-handling']);
    const resp = await api.get('/usuarios/3F7K9P2XQ8M1R6TB');
    expect(resp.status()).toBe(400);

    const body = await parseResponseBody<{ message: string }>(resp);
    expect(body.message).toBe('Usuário não encontrado');
  });

  test('CT16 - Prevent updating user with duplicate e-mail', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'usuarios', 'validation']);
    const email1 = randomEmail();
    const email2 = randomEmail();

    const createUser1Resp = await createUser(api, { email: email1, password: 'Senha123@', name: 'User One' });
    expect(createUser1Resp.status()).toBe(201);

    const createUser1Body = await parseResponseBody<{ _id: string }>(createUser1Resp);

    const createUser2Resp = await createUser(api, { email: email2, password: 'Senha456@', admin: true, name: 'User Two' });
    expect(createUser2Resp.status()).toBe(201);

    const updateResp = await api.put(`/usuarios/${createUser1Body._id}`, {
      data: {
        nome: 'User One Updated',
        email: email2,
        password: 'Senha123@',
        administrador: 'true'
      }
    });

    expect(updateResp.status()).toBe(400);
    const updateBody = await parseResponseBody<{ message: string }>(updateResp);
    expect(updateBody.message).toBe('Este email já está sendo usado');
  });
});
