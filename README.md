# 🧪 Playwright API Testing - ServeRest

[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33.svg)](https://playwright.dev/docs/api/class-test)
[![Node](https://img.shields.io/badge/Node.js-24-43853d.svg)](https://nodejs.org/en)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

Projeto de automação de testes de API utilizando **Microsoft Playwright com TypeScript** e **Node.js 24** para testar a API REST **ServeRest** – uma API gratuita que simula uma loja virtual.

O repositório demonstra como estruturar testes de API 100% em TypeScript, reaproveitando fixtures, utilitários, leitura de dados externos e relatórios avançados com Allure Playwright.

URI do repositório: [https://github.com/reinaldorossetti/playwright-api-typescript-serverest](https://github.com/reinaldorossetti/playwright-api-typescript-serverest)
URL do Allure Report: [allure-reports](https://reinaldorossetti.github.io/playwright-api-typescript-serverest/allure-reports/#/)
Documentação complementar sobre os cenários pode ser encontrada dentro de `src/tests/features`.

### Performance dos Testes com Node 24:

**Versão utilizada:** Node.js v24.11.0.
**Execução:** suíte completa Playwright disparada via npm (6 workers).
**Resultado:** 50 testes passaram em 7.1 s. Os testes em paralelo mantiveram o tempo médio por teste abaixo de 150 ms, com os cenários de carrinho/produtos (1.1 a ⁠1.5s cada) dominando o custo total.

---

## 📚 Índice

- [Sobre o Playwright](#-sobre-o-playwright)
- [Sobre a API ServeRest](#-sobre-a-api-serverest)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [TypeScript - Node.js 24](#-typescript---nodejs-24-no-projeto)
- [Dependências e Versões](#-dependências-e-versões-packagejson)
- [Instalação](#-instalação)
- [Executando os Testes](#-executando-os-testes)
- [Exemplos de Testes](#-exemplos-de-testes)
- [Asserções e Validações](#-asserções-e-validações)
- [Variáveis de Ambiente](#-variáveis-de-ambiente-env)
- [Funcionalidades Nativas](#-funcionalidades-nativas-playwright-api)
- [Relatórios](#-relatórios)
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
3. **Ecossistema Node 24**: aproveita `fetch` nativo, `crypto.randomUUID()`, `structuredClone()` e recursos modernos do runtime.
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
│       │   ├── allureUtils.ts           # Helper compartilhado setSeverityAndTags
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
│           ├── dataUtils.ts             # Leitura de CSV/JSON (com cache em memória)
│           └── fakerUtils.ts            # Dados gerados com @faker-js/faker
├── package.json                         # Scripts e dependências Node 24
├── playwright.config.ts                 # Config global (workers, timeout, reporters)
├── tsconfig.json                        # Configuração TypeScript NodeNext modules
├── .env                                 # Variáveis locais (senha padrão, base URL)
└── README.md
```

---

## 🔧 Pré-requisitos

- **Node.js 24** (LTS — o projeto aproveita recursos modernos do runtime como `fetch` nativo e `crypto.randomUUID()`)
- **npm** 10+ (instalado com o Node)
- **VS Code** com extensões Playwright/TypeScript (opcional, porém recomendado)
- Acesso à internet para consumir a API ServeRest e instalar dependências
- **Java** (opcional) caso deseje abrir o Allure report local usando `allure open`

### Verificar instalação

```bash
node -v
npm -v
```

### Exemplo de recursos Node 24

```ts
// fetch nativo — sem dependências extras
const resp = await fetch('https://serverest.dev/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'fulano@qa.com', password: 'senha@123' })
});
const { authorization } = await resp.json();

// crypto.randomUUID — identificador único nativo
const email = `user-${crypto.randomUUID()}@test.com`;

// structuredClone — cópia profunda sem JSON.parse/stringify
const base = { preco: 100, quantidade: 5 };
const copia = structuredClone(base);
copia.preco = 200; // não altera `base`
```

### Pré-instalação Playwright

```bash
npm install
npx playwright install --with-deps
```
---

## ⚡ TypeScript - Node.js 24 no Projeto

Esta seção aborda recursos modernos do **Node.js 24** (evolução direta do que passou a existir desde o Node 20) aproveitados na suíte de testes.

### 🚀 Destaques do Node.js 20+ (resumo rápido)

| Versão | Recursos em destaque | Benefícios para testes de API |
|--------|----------------------|--------------------------------|
| **Node 20 LTS** | `node:test` runner estável, Permission Model (`--experimental-permission` com `--allow-fs-read`, `--allow-child-process` etc.) e avanços no SEA (Single Executable Apps) | Execução nativa dos testes sem Jest/Mocha, bloqueio de IO/execução inadvertida e opção de empacotar utilitários CLI |
| **Node 22 LTS** | `WebSocket` global estabilizado via Undici 6, `node --watch` maduro e Permission Model cobrindo `worker_threads` e `child_process` além de `npm@10` | Observabilidade mais rápida, DX melhor em suites grandes e paralelismo mais seguro |
| **Node 24.x (versão usada aqui)** | Consolida tudo acima com V8 12.x, `fetch`/`WebSocket` nativos totalmente alinhados ao browser, Permission Model granular e toolchain SEA estável | Menor tempo de startup, APIs Web modernas no runtime server-side e binários reproduzíveis para utilitários |

### 1. `fetch` nativo (sem dependência extra)

Node.js 24 possui o `fetch` estabilizado globalmente — não é necessário incluir `node-fetch`:

```ts
const resp = await fetch('https://serverest.dev/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'fulano@qa.com', password: 'senha@123' })
});
const body = await resp.json();
console.log(body.authorization);
```

### 2. `crypto.randomUUID()` nativo

Geração de identificadores únicos sem importações externas:

```ts
const uniqueEmail = `user-${crypto.randomUUID()}@test.com`;
```

### 3. `structuredClone()` para cópia profunda

Clone profundo de objetos sem `JSON.parse/JSON.stringify`:

```ts
const payloadBase = { preco: 100, quantidade: 5 };
const payload = structuredClone(payloadBase);
payload.preco = 200; // não afeta payloadBase
```

### 4. Modo `--watch` para desenvolvimento

```bash
node --watch src/myScript.ts

# Vigiar e executar testes quando houver mudanças (Node 18+)
node --watch --test src/tests/**/*.spec.ts
```

O `--watch` é uma flag nativa do Node 18+ que reinicia automaticamente o script quando detecta mudanças nos arquivos, eliminando a necessidade de ferramentas como `nodemon`.

### 5. `Record<K, V>` - Tipagem de objetos dinâmicos (TypeScript)

`Record<K, V>` é um **utility type do TypeScript** (desde v2.1, 2016) que cria um tipo para objetos com chaves e valores específicos. Funciona perfeitamente com Node.js 24.

#### 📖 O que é?

`Record<K, V>` significa: "um objeto onde todas as chaves são do tipo `K` e todos os valores são do tipo `V`".

```ts
// Sintaxe básica
type MeuObjeto = Record<string, number>;

// Equivale a:
type MeuObjeto = {
  [chave: string]: number;
};
```

#### 🎯 Exemplos práticos em testes de API

**1. Headers HTTP dinâmicos:**

```ts
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer abc123',
  'X-Custom-Header': 'valor'
};

await api.post('/login', { headers });
```

**2. Validação de erros da API:**

```ts
// API retorna: { "email": "deve ser um email válido", "password": "é obrigatório" }
const body = await response.json() as Record<string, string>;

expect(body.email).toBe('deve ser um email válido');
expect(body.password).toBe('é obrigatório');
```

**3. Parâmetros de query string:**

```ts
const queryParams: Record<string, string> = {
  nome: 'Mouse',
  preco: '100',
  _limit: '10'
};

// Gera: /produtos?nome=Mouse&preco=100&_limit=10
const url = `/produtos?${new URLSearchParams(queryParams)}`;
```

**4. Mapeamento de status codes:**

```ts
const statusMessages: Record<number, string> = {
  200: 'Sucesso',
  201: 'Criado',
  400: 'Requisição inválida',
  401: 'Não autorizado',
  404: 'Não encontrado'
};

console.log(statusMessages[response.status()]); // "Sucesso"
```

**5. Exemplo real do projeto** (`login.spec.ts`):

```ts
test('CT05 - Validate invalid email format', async ({ api }) => {
  const resp = await api.post(API_ROUTES.LOGIN, {
    data: { email: 'emailinvalido', password: 'senha123' }
  });

  expect(resp.status()).toBe(400);
  
  // A API retorna um objeto com erros de validação
  const body = await parseResponseBody<Record<string, string>>(resp);
  expect(body.email).toBeTruthy(); // Verifica que há erro no campo email
});
```

#### 💡 Por que usar?

✅ **Tipagem segura**: TypeScript garante que todas as chaves e valores seguem o contrato  
✅ **Flexibilidade**: Aceita qualquer quantidade de chaves  
✅ **Autocomplete**: IDEs sugerem os tipos corretos  
✅ **Refatoração segura**: Mudanças no tipo são detectadas em compile-time

#### ⚠️ Alternativas quando você conhece as chaves

Se você sabe exatamente quais chaves existem, prefira interfaces:

```ts
// ❌ Muito genérico
type LoginResponse = Record<string, string>;

// ✅ Melhor - contrato explícito
interface LoginResponse {
  authorization: string;
  message: string;
}
```

Use `Record<K, V>` quando as chaves são **dinâmicas** ou **desconhecidas** em tempo de desenvolvimento.

### 🎯 Demonstração Completa

Execute `npm run demo:node22` para rodar o arquivo [`examples/node24-features.cjs`](examples/node24-features.cjs) e acompanhar, na prática, os recursos do Node 20+ que ajudam especificamente em testes de API e medições de performance:

```bash
npm run demo:node22
```

O script cobre as seguintes funções nativas:

| # | Função / API | Por que ajuda em testes |
|---|--------------|------------------------|
| 1 | `node:test` `mock.fn` | Cria dublês nativos para helpers de API sem Jest/Sinon |
| 2 | `mock.timers.enable` / `mock.timers.tick` | Avança o relógio sem esperar, ideal para validar retries e backoffs |
| 3 | `AbortSignal.timeout()` com `fetch` | Impede que testes REST fiquem travados aguardando HTTP |
| 4 | `performance.timerify` + `PerformanceObserver` | Mede a duração de utilitários e detecta regressões de performance |
| 5 | `Promise.withResolvers()` + `timers/promises` | Sincroniza fixtures assíncronas sem boilerplate |
| 6 | `structuredClone` | Duplica fixtures complexas sem risco de mutação compartilhada |

Todos os blocos verificam a versão do runtime e informam fallbacks quando alguém ainda estiver em Node inferior.

**Exemplo de saída:**

```bash
🚀 Demonstração de Recursos do Node.js 24
============================================================
📌 Node.js versão: 24.11.0

🧪 1. node:test mock.fn
✅ Chamadas registradas: 2 — último payload inspecionado direto do mock

⏳ 2. mock.timers.enable
✅ Callbacks executados sem esperar 3s reais; perfeito para fluxos de retry

�️ 3. AbortSignal.timeout
✅ Timeout disparado em ~5 ms, evitando testes travados

� 4. performance.timerify + PerformanceObserver
✅ Função monitorada executou em ~1 ms, com métricas prontas para alertas

🧵 5. Promise.withResolvers + timers/promises
✅ “Fixture liberada após async” sem boilerplate de `new Promise`

� 6. structuredClone
✅ Fixtures clonadas sem `JSON.parse/stringify` e sem mutação compartilhada
```

#### 📚 Demonstração de Record<K, V>

Para ver exemplos práticos de `Record<string, string>` em contexto de testes de API, execute:

```bash
npm run demo:record
# ou
node examples/record-type-usage.ts
```

Este script demonstra **8 casos de uso** do `Record<K, V>`: headers HTTP, validação de erros, query parameters, mapeamento de status codes, configurações, cache de tokens, comparação com interfaces e uso avançado com union types.

### 💡 Boas práticas

- Centralize contexto em fixtures compartilhadas.
- Descreva contratos de resposta usando generics para evitar casts perigosos.
- Prefira `await expect(response).toHaveStatus(…)` dentro dos helpers para manter a sintaxe fluida.

---

## 📦 Dependências e Versões (package.json)

Este projeto gerencia dependências com `npm`. A tabela abaixo reflete o conteúdo do `package.json`:

| Pacote                    | Versão   | Descrição |
|---------------------------|----------|-----------|
| `@playwright/test`        | ^1.58.0  | Runner oficial Playwright com APIRequestContext |
| `typescript`              | ^5.8.2   | Superset tipado de JavaScript |
| `@types/node`             | ^22.13.14| Tipos oficiais do Node 22 (compatíveis com runtime 24) |
| `@faker-js/faker`         | ^9.8.0   | Geração de dados randômicos |
| `allure-playwright`       | ^3.4.1   | Integração Playwright → Allure results |
| `allure-js-commons`       | ^3.4.1   | Enums e funções Allure (`Severity`, `severity`, `tag`) |
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


## ⚙️ Esteira CI/CD - GitHub Actions

- Arquivo: `.github/workflows/playwright.yml`

### 🔁 Quando roda

- `push` para `main`
- `pull_request` direcionado a `main`

### 🧱 Passos principais

1. Checkout
2. Setup Node.js 24 com cache npm
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
import { Severity } from 'allure-js-commons';
import { setSeverityAndTags } from '../../base/allureUtils.js';

test('CT01 - Perform login with valid credentials and validate token', async ({ api }) => {
    await setSeverityAndTags(Severity.CRITICAL, ['api', 'login', 'happy-path']);

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
import { Severity } from 'allure-js-commons';
import { setSeverityAndTags } from '../../base/allureUtils.js';

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
    const cart = await parseResponseBody<{ _id: string; message: string }>(createCartResp);

    const getResp = await api.get(`${API_ROUTES.CARTS}/${cart._id}`);
    expect(getResp.status()).toBe(200);
    const body = await parseResponseBody<{ produtos: unknown[]; precoTotal: number }>(getResp);
    expect(body.produtos).toHaveLength(1);
    expect(body.precoTotal).toBeGreaterThan(0);

    const concludeResp = await api.delete(API_ROUTES.CART_CONCLUDE, { headers: withAuth(token) });
    expect(concludeResp.status()).toBe(200);
});
```

---

## ✅ Asserções e Validações

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

## 🔐 Variáveis de Ambiente (.env)

Utilizamos [`dotenv`](https://github.com/motdotla/dotenv) para carregar valores sensíveis como senhas padrão e URLs a partir de um arquivo `.env`, mantendo credenciais fora do código-fonte.

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

## 🎯 Funcionalidades Nativas (Playwright API)

Recursos e padrões nativos utilizados nos testes com Playwright TypeScript:

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

### 🚀 Instalação e Configurações do Allure CLI

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

Scripts equivalentes foram adicionados ao `package.json` para facilitar (`npm run allure:open` e `npm run allure:open`).

No CI, os diretórios `allure-results` e `allure-report` são carregados como artefatos para consulta posterior.

### 🏷️ Allure Report — Decorators

Utilizamos o helper compartilhado `setSeverityAndTags` (em `src/tests/base/allureUtils.ts`) para definir criticidade e tags de forma consistente em todos os specs, sem duplicação.

#### Helper compartilhado

```ts
// src/tests/base/allureUtils.ts
import { Severity, severity, tag } from 'allure-js-commons';

export const setSeverityAndTags = async (sev: Severity, tags: string[] = []): Promise<void> => {
  await severity(sev);
  for (const t of tags) { await tag(t); }
};
```

#### Uso nos specs

```ts
import { Severity } from 'allure-js-commons';
import { setSeverityAndTags } from '../../base/allureUtils.js';

test('CT02 - Login inválido retorna 401', async ({ api }) => {
    await setSeverityAndTags(Severity.NORMAL, ['api', 'login', 'negative']);

    const response = await api.post(API_ROUTES.LOGIN, {
        data: { email: 'usuario@inexistente.com', password: 'senhaerrada' }
    });

    expect(response.status()).toBe(401);
    const body = await parseResponseBody<{ message: string }>(response);
    expect(body.message).toBe('Email e/ou senha inválidos');
});
```

#### Severidades disponíveis

| Enum (`Severity`) | Uso |
|-------------------|-----|
| `Severity.BLOCKER` | Impede release |
| `Severity.CRITICAL` | Fluxo principal |
| `Severity.NORMAL` | Casos médios |
| `Severity.MINOR` | Impacto baixo |
| `Severity.TRIVIAL` | Edge cases |

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
