# 🧪 Playwright API Testing - ServeRest (TypeScript)

Projeto espelho do projeto Java original, migrado para **TypeScript** com:

- **Playwright Test** para testes de API
- **Allure Reports** para relatório de execução
- Estrutura organizada por **features** (`login`, `usuarios`, `produtos`, `carrinhos`)

## 📁 Estrutura

```text
playwright-api-typescript-serverest/
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── src/
│   └── tests/
│       ├── base/
│       │   ├── api.fixture.ts
│       │   └── apiHelpers.ts
│       ├── utils/
│       │   ├── dataUtils.ts
│       │   └── fakerUtils.ts
│       ├── features/
│       │   ├── login/
│       │   │   └── login.spec.ts
│       │   ├── usuarios/
│       │   │   └── users.spec.ts
│       │   ├── produtos/
│       │   │   └── products.spec.ts
│       │   └── carrinhos/
│       │       └── carts.spec.ts
│       └── resources/
│           └── playwright_serverest/
│               ├── login/
│               ├── usuarios/resources/
│               └── produtos/resources/
```

## ✅ Cobertura portada do projeto Java

Foram portados os mesmos cenários do projeto Java, totalizando **50 testes** em TypeScript.

## ▶️ Como executar

```bash
npm install
npm test
```

Executar por feature:

```bash
npm run test:login
npm run test:usuarios
npm run test:produtos
npm run test:carrinhos
```

## 📊 Allure Reports

Gerar relatório:

```bash
npm run allure:generate
```

Abrir relatório:

```bash
npm run allure:open
```

## 🌐 API alvo

- Base URL: `https://serverest.dev`
