/**
 * Demonstra os recursos do Node.js 20+ que impactam diretamente testes automatizados
 * e diagnósticos de performance. Execute com: npm run demo:node24
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

const { mock } = require('node:test');
const assert = require('node:assert/strict');
const { performance, PerformanceObserver } = require('node:perf_hooks');
const { setTimeout: delay } = require('node:timers/promises');

async function demonstrateNodeTestMocks() {
  console.log('\n🧪 1. node:test mock.fn — dublês de funções sem libs externas (Node 20+)');

  if (typeof mock?.fn !== 'function') {
    console.log('⚠️  mock.fn requer Node 20+. Atualize seu runtime para utilizar os doubles nativos.');
    return;
  }

  const createUser = mock.fn(async ({ email }) => ({ id: crypto.randomUUID(), email }));

  await createUser({ email: 'qa+1@node24.dev' });
  await createUser({ email: 'qa+2@node24.dev' });

  console.log(`✅ Chamadas registradas: ${createUser.mock.calls.length}`);
  console.log('   Último payload inspecionado diretamente do mock:', createUser.mock.calls.at(-1).arguments[0]);
}

async function demonstrateMockTimers() {
  console.log('\n⏳ 2. mock.timers.enable — controle total do relógio nos testes (Node 20+)');

  if (typeof mock?.timers?.enable !== 'function') {
    console.log('⚠️  mock.timers requer Node 20+.');
    return;
  }

  mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const events = [];

  setTimeout(() => {
    events.push({ label: 'retry', now: Date.now() });
  }, 3_000);

  mock.timers.tick(3_000);
  mock.timers.reset();

  console.log(`✅ Callbacks executados sem esperar 3s reais. Captura:`, events[0]);
}

async function demonstrateAbortableFetch() {
  console.log('\n🛡️ 3. AbortSignal.timeout — testes HTTP que não travam (Node 18.11+)');

  if (typeof AbortSignal?.timeout !== 'function') {
    console.log('⚠️  AbortSignal.timeout ainda não disponível nesse runtime.');
    return;
  }

  try {
    await fetch('https://serverest.dev/usuarios', {
      signal: AbortSignal.timeout(5),
      headers: { Accept: 'application/json' }
    });
    console.log('⚠️  A requisição terminou rápido demais para demonstrar o timeout.');
  } catch (error) {
    console.log('✅ Timeout disparado em ~5ms, evitando testes travados:', error.name);
  }
}

async function demonstratePerformanceTimerify() {
  console.log('\n🚀 4. performance.timerify + PerformanceObserver — métricas embutidas (Node 20+)');

  const entries = [];
  const observer = new PerformanceObserver((list) => {
    entries.push(...list.getEntries());
  });
  observer.observe({ entryTypes: ['function'] });

  const buildPayload = performance.timerify((records) => {
    return Array.from({ length: records }, (_, idx) => ({
      id: idx,
      price: Math.round(Math.sin(idx) * 1000) / 100,
      tag: idx % 2 === 0 ? 'even' : 'odd'
    }));
  });

  buildPayload(5_000);
  await delay(0);
  observer.disconnect();

  const [entry] = entries;
  if (entry) {
    console.log(`✅ Função monitorada "${entry.name}" executou em ${entry.duration.toFixed(2)}ms`);
  } else {
    console.log('⚠️  PerformanceObserver não recebeu entradas. Verifique suporte do runtime.');
  }
}

async function demonstratePromiseWithResolvers() {
  console.log('\n🧵 5. Promise.withResolvers — sincronização sem boilerplate (Node 20+)');

  if (typeof Promise.withResolvers !== 'function') {
    console.log('⚠️  Promise.withResolvers requer Node 20+.');
    return;
  }

  const { promise, resolve } = Promise.withResolvers();
  void delay(50).then(() => resolve('suite liberada após fixture async 🚀'));
  console.log('   Aguardando fixture...');
  console.log(`✅ ${await promise}`);
}

async function demonstrateStructuredCloneForFixtures() {
  console.log('\n📦 6. structuredClone — estados-base imutáveis para fixtures');

  if (typeof structuredClone !== 'function') {
    console.log('⚠️  structuredClone requer Node 17+.');
    return;
  }

  const defaultUser = {
    name: 'Admin QA',
    permissions: ['create', 'read', 'update', 'delete'],
    tokens: { access: crypto.randomUUID() }
  };

  const clone = structuredClone(defaultUser);
  clone.permissions.push('impersonate');

  assert.strictEqual(defaultUser.permissions.includes('impersonate'), false);
  console.log('✅ Fixtures podem ser clonadas sem JSON.parse/stringify e sem mutações indesejadas.');
}

async function main() {
  console.log('🧰  Node.js 24 — Recursos focados em testes e performance');
  console.log('='.repeat(70));
  console.log(`Runtime detectado: ${process.versions.node}`);

  await demonstrateNodeTestMocks();
  await demonstrateMockTimers();
  await demonstrateAbortableFetch();
  await demonstratePerformanceTimerify();
  await demonstratePromiseWithResolvers();
  await demonstrateStructuredCloneForFixtures();

  console.log('\n' + '='.repeat(70));
  console.log('✅ Demonstração concluída. Aproveite esses recursos nos seus testes Playwright!');
}

main().catch((error) => {
  console.error('❌ Execução encerrada com erro:', error);
  process.exitCode = 1;
});
