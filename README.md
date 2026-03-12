# 🧪 Playwright API Testing - ServeRest

[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33.svg)](https://playwright.dev/docs/api/class-test)
[![Node](https://img.shields.io/badge/Node.js-20%2B-43853d.svg)](https://nodejs.org/en)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

Projeto de automação de testes de API utilizando **Microsoft Playwright com TypeScript** e **Node.js 20+** para testar a API REST **ServeRest** – uma API gratuita que simula uma loja virtual.

O repositório demonstra como estruturar testes de API 100% em TypeScript, reaproveitando fixtures, utilitários, leitura de dados externos e relatórios avançados com Allure Playwright.

URI do repositório: [https://github.com/reinaldorossetti/playwright-api-typescript-serverest](https://github.com/reinaldorossetti/playwright-api-typescript-serverest)

Documentação complementar sobre os cenários pode ser encontrada dentro de `src/tests/features`.

---

## 📚 Índice

- [Sobre o Playwright](#-sobre-o-playwright)
- [Sobre a API ServeRest](#-sobre-a-api-serverest)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Python no Projeto](#-python-no-projeto)
- [Instalação](#-instalação)
- [Executando os Testes](#-executando-os-testes)
- [Exemplos de Testes](#-exemplos-de-testes)
- [assert_that — Assertpy](#-assert_that--assertpy)
- [Variáveis de Ambiente — python-dotenv](#-variáveis-de-ambiente--python-dotenv)
- [Funcionalidades do Playwright](#-funcionalidades-do-playwright)
- [Relatórios](#-relatórios)
- [Allure Report — Decorators](#-allure-report--decorators)
- [Boas Práticas](#-boas-práticas)
- [Recursos Adicionais](#-recursos-adicionais)

---

## 🧪 Sobre o Playwright

**Playwright** é um framework open-source da Microsoft. Além dos cenários de browser, o runner oficial em TypeScript expõe a API `request.newContext()` para testar HTTP/REST com o mesmo ecossistema de fixtures e `expect` nativo.

### ✨ Principais Características para este projeto

- **🔥 APIRequestContext**: criação de requisições `get`, `post`, `put`, `delete` com headers e payloads JSON.
- **🚀 Tipagem forte**: toda a suíte é escrita em TypeScript, garantindo autocompletes e contratos claros.
- **🎯 `expect` do Playwright Test**: assertions consistentes sem dependências extras.
- **🔄 Fixtures customizadas**: `api.fixture.ts` entrega `APIRequestContext` já autenticado e com headers padrão.
- **📊 Integração nativa com Allure Playwright**: geração automática de resultados e HTML final via `allure-commandline`.
- **🧪 Data-Driven**: leitura de CSV/JSON em `src/tests/resources` com utilitários próprios.
- **⚡ Execução paralela**: configurada no `playwright.config.ts` com até 6 workers.
- **🔐 Autenticação**: helpers criam usuários, produtos e tokens em runtime.

### 💡 Por que usar Playwright para API em TypeScript?

1. **Stack única**: Playwright test runner cobre API, UI e WebSocket na mesma base.
2. **DX moderna**: tipagem, ESLint integrado e suporte total ao VS Code.
3. **Ecosistema Node 20+**: aproveita `fetch`, `crypto` e recursos atuais do runtime.
4. **Observabilidade**: Allure + traços Playwright facilitam troubleshooting.
5. **CI/CD direto**: GitHub Actions roda `npx playwright test` sem configuração complexa.

---

## 🌐 Sobre a API ServeRest

[ServeRest](https://serverest.dev/) é uma API REST gratuita que simula uma loja virtual completa. Ela é o back-end ideal para demonstrar cadastros, autenticação e fluxos de carrinho.

### 🛍️ Endpoints Disponíveis

| Recurso | Endpoints | Descrição |
|---------|-----------|-----------|
| **Login** | `POST /login` | Autenticação de usuários |
| **Usuários** | `GET, POST, PUT, DELETE /usuarios` | Gerenciamento de usuários |
| **Produtos** | `GET, POST, PUT, DELETE /produtos` | Gerenciamento de produtos (requer admin) |
| **Carrinhos** | `GET, POST, DELETE /carrinhos` | Gerenciamento de carrinhos de compras |

### 🔗 Base URL

```text
https://serverest.dev
```

### 📖 Documentação Completa

- **Swagger UI**: https://serverest.dev/
- **Repositório**: https://github.com/ServeRest/ServeRest
- **Front-end (Beta)**: https://front.serverest.dev/

---

## 📁 Estrutura do Projeto

```text
playwright-api-typescript-serverest/
│
├── .github/
│   └── workflows/
│       └── playwright.yml               # Pipeline CI com Playwright + Allure
├── src/
│   └── tests/
│       ├── base/
│       │   ├── api.fixture.ts           # Fixture compartilhada com APIRequestContext
│       │   ├── apiHelpers.ts            # Helpers (login, produtos, usuários)
│       │   ├── constants.ts             # Rotas + senhas provenientes do .env
│       │   ├── env.ts                   # Carregamento e validação de variáveis de ambiente
│       │   └── http.ts                  # Helpers para headers/autenticação
│       ├── features/
│       │   ├── login/login.spec.ts
│       │   ├── usuarios/users.spec.ts
│       │   ├── produtos/products.spec.ts
│       │   └── carrinhos/carts.spec.ts
│       ├── resources/
│       │   └── playwright_serverest/... # CSV/JSON usados nos testes
│       └── utils/
│           ├── dataUtils.ts             # Leitura de CSV/JSON
│           └── fakerUtils.ts            # Dados gerados com @faker-js/faker
├── package.json                         # Scripts e dependências Node 20+
├── playwright.config.ts                 # Config global (workers, timeout, reporters)
├── tsconfig.json                        # Configuração TypeScript Node16 modules
├── .env                                 # Variáveis locais (senha padrão, base URL)
└── README.md
```

---

## 🔧 Pré-requisitos

- **Node.js 20+** (o projeto utiliza recursos do runtime atual)
- **npm** 10+ (instalado com o Node)
- **VS Code** com extensões Playwright/TypeScript (opcional, porém recomendado)
- Acesso à internet para consumir a API ServeRest e instalar dependências
- **Java** (opcional) caso deseje abrir o Allure report local usando `allure open`

### Verificar instalação

```bash
node -v
npm -v
```

### Pré-instalação Playwright

```bash
npm install
npx playwright install --with-deps
```
---

## 🐍 Python no Projeto

Apesar do título da seção, o repositório foi migrado inteiramente para **TypeScript**. Aqui registramos o paralelo de como os conceitos Python foram traduzidos:

1. **Payloads JSON** agora são objetos tipados em TypeScript:

```ts
const payload = {
    nome: `Product ${Date.now()}`,
    preco: 250,
    descricao: 'Produto de teste',
    quantidade: 10
};
```

2. **Fixtures do Pytest** foram substituídas por `test.extend` no `api.fixture.ts`:

```ts
export const test = base.extend<ApiFixtures>({
    api: async ({ playwright }, use) => {
        const api = await playwright.request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: { 'Content-Type': 'application/json' }
        });
        await use(api);
        await api.dispose();
    }
});
```

3. **Type Hints** viraram interfaces/`type` e generics em helpers como `parseResponseBody<T>()`.

### 💡 Boas práticas herdadas

- Centralize contexto em fixtures compartilhadas.
- Descreva contratos de resposta usando generics para evitar casts perigosos.
- Prefira `await expect(response).toHaveStatus(…)` ou assertions personalizadas dentro dos helpers para manter a sintaxe fluida.

---

## 📦 Dependências e Versões (requirements.txt)

Este projeto utiliza `npm` em vez de `requirements.txt`. A tabela abaixo reflete o conteúdo do `package.json`:

| Pacote                    | Versão   | Descrição |
|---------------------------|----------|-----------|
| `@playwright/test`        | ^1.58.0  | Runner oficial Playwright com APIRequestContext |
| `typescript`              | ^5.8.2   | Superset tipado de JavaScript |
| `@types/node`             | ^22.13.14| Tipos do Node 20 |
| `@faker-js/faker`         | ^9.8.0   | Geração de dados randômicos |
| `allure-playwright`       | ^3.4.1   | Integração Playwright → Allure results |
| `allure-commandline`      | ^2.34.1  | CLI para gerar/abrir HTML do Allure |
| `dotenv`                  | ^17.3.1  | Carregamento de variáveis do `.env` |

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/reinaldorossetti/playwright-api-typescript-serverest.git
cd playwright-api-typescript-serverest
```

### 2. Instale as dependências e os browsers

```bash
npm install
npx playwright install --with-deps
```

### 3. Configure as variáveis de ambiente

Copie `.env.example` (ou utilize o `.env` fornecido) e ajuste conforme necessário:

```env
DEFAULT_USER_PASSWORD=SenhaSegura@123
API_BASE_URL=https://serverest.dev
```

---

## ▶️ Executando os Testes

Toda a configuração fica no `playwright.config.ts`.

### Executar suíte completa

```bash
npm test
# ou
npx playwright test
```

### Executar funcionalidade específica (ex.: login)

```bash
npm run test:login
```

### Executar arquivo isolado

```bash
npx playwright test src/tests/features/produtos/products.spec.ts
```

### Executar um único cenário

```bash
npx playwright test src/tests/features/login/login.spec.ts --grep "CT01"
```

### Paralelismo

O `playwright.config.ts` está com `workers: 6`. Para sobrescrever durante a execução:

```bash
npx playwright test --workers=auto
```

---

## ⚙️ Esteira CI/CD - GitHub Actions

- Arquivo: `.github/workflows/playwright.yml`

### 🔁 Quando roda

- `push` para `main`
- `pull_request` direcionado a `main`

### 🧱 Passos principais

1. Checkout
2. Setup Node.js 22 com cache npm
3. `npm ci`
4. `npx playwright install --with-deps`
5. `npx playwright test`
6. `npm run allure:generate`
7. Upload de `allure-results` e `allure-report` como artefatos

### 🌐 Relatório

Utilize `actions/download-artifact` para baixar o HTML ou gere localmente com `npm run allure:open` (ajuste no script conforme preferência).

---

## 📝 Exemplos de Testes

### Exemplo 1: Fixture base (`src/tests/base/api.fixture.ts`)

```ts
import { test as base, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { env } from './env';

type ApiFixtures = { api: APIRequestContext };

export const test = base.extend<ApiFixtures>({
    api: async ({ playwright }, use) => {
        const api = await playwright.request.newContext({
            baseURL: env.apiBaseUrl,
            extraHTTPHeaders: { 'Content-Type': 'application/json' }
        });
        await use(api);
        await api.dispose();
    }
});

export { expect };
```

### Exemplo 2: Login com sucesso (`src/tests/features/login/login.spec.ts`)

```ts
import { allure } from 'allure-playwright';
import { Severity } from 'allure-js-commons';

test('CT01 - Perform login with valid credentials and validate token', async ({ api }) => {
    await allure.severity(Severity.CRITICAL);
    await allure.tag('api');
    await allure.tag('login');

    const email = randomEmail();
    const password = DEFAULT_USER_PASSWORD;

    await createUser(api, { email, password });
    const resp = await api.post(API_ROUTES.LOGIN, { data: { email, password } });

    expect(resp.status()).toBe(200);
    const body = await parseResponseBody<{ authorization: string; message: string }>(resp);
    expect(body.authorization).toBeTruthy();
    expect(body.message).toBe('Login realizado com sucesso');
});
```

### Exemplo 3: Login inválido

```ts
test('CT02 - Attempt login with invalid credentials', async ({ api }) => {
    const resp = await api.post(API_ROUTES.LOGIN, {
        data: { email: 'usuario@inexistente.com', password: 'senhaerrada' }
    });

    expect(resp.status()).toBe(401);
    const body = await parseResponseBody<{ message: string }>(resp);
    expect(body.message).toBe('Email e/ou senha inválidos');
});
```

### Exemplo 4: Validação de campos obrigatórios (CSV + tabelas)

```ts
const invalidEmails = readCsvColumn('playwright_serverest', 'login', 'invalid-login-emails.csv');

for (const invalidEmail of invalidEmails) {
    test(`CT05 - Validate invalid email format: ${invalidEmail}`, async ({ api }) => {
        const resp = await api.post(API_ROUTES.LOGIN, {
            data: { email: invalidEmail, password: 'senha123' }
        });

        expect(resp.status()).toBe(400);
        const body = await parseResponseBody<Record<string, string>>(resp);
        expect(body.email).toBeTruthy();
    });
}
```

### Exemplo 5: Uso de token dinâmico

```ts
const token = await createAdminAndGetToken(api);
const productId = await createProduct(api, token, { quantity: 10 });

const resp = await api.delete(`${API_ROUTES.PRODUCTS}/${productId}`, { headers: withAuth(token) });
expect(resp.status()).toBe(200);
```

### Exemplo 6: Leitura de CSV (`dataUtils.ts`)

```ts
export function readCsvLines(...parts: string[]): string[] {
    const filePath = resourcePath(...parts);
    return fs
        .readFileSync(filePath, 'utf-8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}
```

### Exemplo 7: Ciclo completo de carrinho (`src/tests/features/carrinhos/carts.spec.ts`)

```ts
import { allure } from 'allure-playwright';
import { Severity } from 'allure-js-commons';

test('CT01 - Full cart lifecycle for authenticated admin', async ({ api }) => {
    await allure.severity(Severity.CRITICAL);
    await allure.tag('api');
    await allure.tag('carts');

    const { token } = await createAdminAndLogin(api);
    await ensureCartIsClean(api, token);

    const productId = await createProduct(api, token, {
        nome: `Produto ${Date.now()}`,
        preco: 150,
        descricao: 'Produto de teste',
        quantidade: 10
    });

    const cartResp = await createCart(api, token, { produtos: [{ idProduto: productId, quantidade: 2 }] });
    expect(cartResp.status()).toBe(201);
    const cart = await parseResponseBody<{ _id: string }>(cartResp);

    const getResp = await api.get(`${API_ROUTES.CARTS}/${cart._id}`);
    expect(getResp.status()).toBe(200);
    const body = await parseResponseBody<{ produtos: unknown[]; precoTotal: number }>(getResp);
    expect(body.produtos).toHaveLength(1);
    expect(body.precoTotal).toBeGreaterThan(0);

    const finishResp = await api.delete(API_ROUTES.CARTS_FINISH, { headers: withAuth(token) });
    expect(finishResp.status()).toBe(200);
});
```

---

## ✅ assert_that — Assertpy

Mantivemos o título para preservar o índice, mas agora utilizamos a API `expect` do Playwright Test para asserções fluentes e tipadas.

### Importação

```ts
import { expect } from '../base/api.fixture';
```

### Principais métodos usados

| Método Playwright                   | Descrição |
|------------------------------------|-----------|
| `expect(res.status()).toBe(200)`   | Igualdade exata|
| `expect(value).toBeTruthy()`       | Valor truthy |
| `expect(value).toBeFalsy()`        | Valor falsy |
| `expect(array).toHaveLength(n)`    | Tamanho da coleção |
| `expect(number).toBeGreaterThan(n)`| Comparação numérica |
| `expect(object).toMatchObject({...})` | Subconjunto de propriedades |
| `await expect(response).toHaveStatus(201)` | Assertion nativa para respostas |
| `await expect.poll(async () => ...)` | Repetição até condição ser atendida |

### Exemplo com status e corpo da resposta

```ts
const resp = await api.get(API_ROUTES.USERS);
await expect(resp).toHaveStatus(200);

const body = await parseResponseBody<{ quantidade: number; usuarios: unknown[] }>(resp);
expect(body.quantidade).toBeGreaterThan(0);
expect(body.usuarios).toHaveLength(body.quantidade);
```

### Encadeamento com helpers

```ts
const body = await parseResponseBody<{ message: string }>(resp);
expect(body.message).toContain('sucesso');
```

### Snapshot testing (opcional)

Para casos estáveis, integramos o `toMatchSnapshot` do Playwright:

```ts
expect(body).toMatchSnapshot('users-list.json');
```

Os snapshots ficam em `src/tests/__snapshots__` e podem ser atualizados com `npx playwright test --update-snapshots`.

---

## 🔐 Variáveis de Ambiente — python-dotenv

Seguimos o mesmo conceito desta seção, porém agora usamos [`dotenv`](https://github.com/motdotla/dotenv) no ecossistema Node para popular valores sensíveis como senhas padrão e URLs.

### Arquivo `.env`

Crie um arquivo na raiz com o seguinte conteúdo:

```env
DEFAULT_USER_PASSWORD=SenhaSegura@123
API_BASE_URL=https://serverest.dev
```

O arquivo está listado no `.gitignore` e não deve ser versionado.

### Carregamento automático

`src/tests/base/env.ts` lê o `.env` logo no bootstrap:

```ts
import { config } from 'dotenv';
import { z } from 'zod';

config();

const schema = z.object({
        DEFAULT_USER_PASSWORD: z.string().min(6),
        API_BASE_URL: z.string().url()
});

export const env = schema.parse(process.env);
```

Com isso, qualquer teste pode importar `env.DEFAULT_USER_PASSWORD` ou `env.apiBaseUrl` sem repetir lógica.

### Valores padrão

É possível usar fallback direto na leitura:

```ts
const password = env.DEFAULT_USER_PASSWORD ?? 'SenhaFallback@123';
```

Prefira, contudo, manter o `.env` atualizado para garantir o mesmo comportamento local e no CI (onde as variáveis podem ser injetadas como `secrets`).

---

## 🎯 Funcionalidades e Sintaxe Nativas (Playwright Python API)

Mantendo o título original, mas descrevendo como aplicamos os mesmos conceitos no runner TypeScript:

### 1. Inicialização de um contexto isolado

```ts
const api = await request.newContext({
    baseURL: env.apiBaseUrl,
    extraHTTPHeaders: { 'Content-Type': 'application/json' }
});
```

### 2. Requisições fluentes com opções combinadas

```ts
const response = await api.post(API_ROUTES.LOGIN, {
    headers: withAuth(token),
    data: { email, password }
});
```

### 3. Extração imediata do JSON

```ts
const body = await response.json();
const authorizationToken = body.authorization;
const httpStatus = response.status();
```

### 4. Hooks e fixtures

```ts
test.beforeEach(async ({ api }) => {
    await ensureCartIsClean(api);
});
```

### 5. Helpers reutilizáveis

```ts
export async function postJson<T>(api: APIRequestContext, route: string, data: unknown) {
    const response = await api.post(route, { data });
    await expect(response).toHaveStatus(201);
    return parseResponseBody<T>(response);
}
```

---

## 📊 Relatórios

Playwright e Allure trabalham juntos através do pacote `allure-playwright`, que converte automaticamente as execuções em JSON armazenados em `allure-results/`.

### Instalação do Allure CLI

Já incluída como dependência de desenvolvimento (`allure-commandline`). Instale os binários globalmente caso deseje rodar fora do `npx`:

```bash
npm install -g allure-commandline
```

### Fluxo local

```bash
# Executa os testes e gera allure-results
npx playwright test

# Gera HTML estático e abre no navegador
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Scripts equivalentes foram adicionados ao `package.json` para facilitar (`npm run allure:report` e `npm run allure:open`).

No CI, os diretórios `allure-results` e `allure-report` são carregados como artefatos para consulta posterior.

### 🏷️ Allure Report — Decorators

Utilizamos diretamente o `allure` exportado por `allure-playwright`, aliado às enums de `allure-js-commons`, para definir criticidade e metadados sem helpers adicionais.

#### Chamadas úteis

| Chamada | Descrição |
|---------|-----------|
| `await allure.severity(Severity.CRITICAL)` | Define criticidade do caso |
| `await allure.tag('api')` | Adiciona tags |
| `await allure.epic('Autenticação')` | Registra épicos/histórias |
| `await allure.story('Login inválido')` | Story específica |
| `await allure.link('https://serverest.dev', 'ServeRest')` | Adiciona links |
| `await allure.owner('squad-api')` | Define responsável |

#### Severidades disponíveis

| Enum (`Severity`) | Uso |
|-------------------|-----|
| `Severity.BLOCKER` | Impede release |
| `Severity.CRITICAL` | Fluxo principal |
| `Severity.NORMAL` | Casos médios |
| `Severity.MINOR` | Impacto baixo |
| `Severity.TRIVIAL` | Edge cases |

#### Exemplo completo (TypeScript)

```ts
import { allure } from 'allure-playwright';
import { Severity } from 'allure-js-commons';

test('CT02 - Login inválido retorna 401', async ({ api }) => {
    await allure.severity(Severity.CRITICAL);
    await allure.epic('Autenticação');
    await allure.feature('Login');
    await allure.story('Negativa - credenciais inválidas');
    await allure.tag('api');
    await allure.tag('negative');

    const response = await api.post(API_ROUTES.LOGIN, {
        data: { email: 'usuario@inexistente.com', password: 'senhaerrada' }
    });

    await expect(response).toHaveStatus(401);
    const body = await parseResponseBody<{ message: string }>(response);
    expect(body.message).toBe('Email e/ou senha inválidos');
});
```

---

## 🎓 Boas Práticas

### 1. Organização dos arquivos

- Separe domínios em `src/tests/features/<domínio>/<arquivo>.spec.ts`.
- Utilize descrições de teste claras (`test('CT01 - ...')`).
- Centralize strings compartilhadas (rotas, mensagens) em `constants.ts`.

### 2. Helpers e reutilização

- Prefira helpers para criação de usuários/produtos (`apiHelpers.ts`).
- Evite duplicar leitura de arquivos – use `dataUtils.ts`.
- Crie funções para montar headers de autenticação e manipular tokens.

### 3. Configuração e fixtures

- Use `test.extend` para compartilhar `APIRequestContext` com headers prontos.
- Defina `retries`, `timeout` e `workers` no `playwright.config.ts` para garantir previsibilidade.
- Habilite `reportSlowTests` para identificar gargalos.

### 4. Qualidade de código

- Habilite `strict` no `tsconfig` para detectar problemas cedo.
- Execute `npm run lint` (se configurado) antes de enviar PRs.
- Sempre gere Allure após alterações relevantes para validar o storytelling.

---

## 📚 Recursos Adicionais

### Documentação Oficial

- 🎭 **Playwright Test**: https://playwright.dev/docs/test-api-testing
- 🌐 **ServeRest**: https://serverest.dev/
- 💙 **TypeScript**: https://www.typescriptlang.org/docs/
- 📊 **Allure Playwright**: https://github.com/allure-framework/allure-js/blob/master/packages/allure-playwright/README.md

### Comunidade

- [Stack Overflow - Playwright tag](https://stackoverflow.com/questions/tagged/playwright)
- [Playwright GitHub Issues](https://github.com/microsoft/playwright/issues)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido para fins de estudo e prática de automação de testes de API.

---

## ⭐ Agradecimentos

- **Microsoft** - Criadora do Playwright
- **Paulo Gonçalves** - Criador da API ServeRest
- Comunidade Playwright & TypeScript - referências constantes
- Pessoas que mantêm exemplos e dados públicos para testes

---

Referências:
- https://playwright.dev/docs/test-intro
- https://www.typescriptlang.org/docs/
- https://github.com/allure-framework/allure-js

**🚀 Happy Testing with Playwright + TypeScript!** 🎭
