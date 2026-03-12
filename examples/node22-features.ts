/**
 * Demonstração de recursos exclusivos do Node.js 22
 * Execute com: node examples/node22-features.ts
 * 
 * Nota: Este script funciona parcialmente no Node 20 com fallbacks
 * Para melhor experiência, use Node.js 22+
 */

// 1. fetch nativo - sem necessidade de node-fetch ou axios
async function demonstrateFetch() {
  console.log('\n🌐 1. Fetch Nativo (sem dependências externas)');
  try {
    const response = await fetch('https://serverest.dev/usuarios', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(`✅ Usuários encontrados: ${data.quantidade}`);
  } catch (error) {
    console.log('⚠️  Fetch nativo requer Node 18+');
  }
}

// 2. crypto.randomUUID() - geração nativa de UUIDs
function demonstrateCrypto() {
  console.log('\n🔐 2. crypto.randomUUID() nativo');
  const uuid1 = crypto.randomUUID();
  const uuid2 = crypto.randomUUID();
  console.log(`✅ UUID 1: ${uuid1}`);
  console.log(`✅ UUID 2: ${uuid2}`);
  
  // Útil para gerar emails únicos em testes
  const uniqueEmail = `user-${crypto.randomUUID()}@test.com`;
  console.log(`✅ Email único: ${uniqueEmail}`);
}

// 3. structuredClone() - cópia profunda nativa
function demonstrateStructuredClone() {
  console.log('\n📋 3. structuredClone() - cópia profunda sem JSON.parse/stringify');
  
  const original = {
    nome: 'Produto Original',
    preco: 100,
    estoque: { quantidade: 50, localizacao: 'SP' },
    tags: ['novo', 'promocao']
  };
  
  const copia = structuredClone(original);
  copia.preco = 200;
  copia.estoque.quantidade = 10;
  copia.tags.push('modificado');
  
  console.log(`✅ Original mantido: preco=${original.preco}, estoque.quantidade=${original.estoque.quantidade}, tags=${original.tags.length}`);
  console.log(`✅ Cópia modificada: preco=${copia.preco}, estoque.quantidade=${copia.estoque.quantidade}, tags=${copia.tags.length}`);
}

// 4. Array métodos imutáveis (toSorted, toReversed, toSpliced) - Node 22+
function demonstrateImmutableArrays() {
  console.log('\n🔄 4. Métodos imutáveis de Array (Node 22+)');
  
  const precos = [150, 200, 100, 300, 50];
  
  // Verifica se os métodos estão disponíveis
  if (typeof Array.prototype.toSorted === 'function') {
    const precosOrdenados = precos.toSorted((a, b) => a - b);
    console.log(`✅ Original: [${precos}]`);
    console.log(`✅ Ordenado: [${precosOrdenados}]`);
    
    const precosRevertidos = precos.toReversed();
    console.log(`✅ Revertido: [${precosRevertidos}]`);
    
    const semSegundo = precos.toSpliced(1, 1);
    console.log(`✅ Sem segundo item: [${semSegundo}]`);
    console.log(`✅ Original intacto: [${precos}]`);
  } else {
    console.log('⚠️  Métodos imutáveis de Array requerem Node.js 22+');
    console.log('   Use Node 22 para ver: toSorted(), toReversed(), toSpliced()');
  }
}

// 5. Object.groupBy() - agrupamento nativo - Node 22+
function demonstrateGroupBy() {
  console.log('\n📊 5. Object.groupBy() - agrupamento nativo (Node 22+)');
  
  const produtos = [
    { nome: 'Mouse', categoria: 'Periféricos', preco: 50 },
    { nome: 'Teclado', categoria: 'Periféricos', preco: 150 },
    { nome: 'Monitor', categoria: 'Monitores', preco: 800 },
    { nome: 'Webcam', categoria: 'Periféricos', preco: 200 },
    { nome: 'Headset', categoria: 'Audio', preco: 300 }
  ];
  
  if (typeof Object.groupBy === 'function') {
    const porCategoria = Object.groupBy(produtos, (p) => p.categoria);
    
    console.log('✅ Produtos agrupados por categoria:');
    for (const [categoria, items] of Object.entries(porCategoria)) {
      console.log(`   ${categoria}: ${items.length} produto(s)`);
    }
  } else {
    console.log('⚠️  Object.groupBy() requer Node.js 22+');
    console.log('   Fallback com reduce():');
    const porCategoria = produtos.reduce((acc, p) => {
      acc[p.categoria] = acc[p.categoria] || [];
      acc[p.categoria].push(p);
      return acc;
    }, {});
    for (const [categoria, items] of Object.entries(porCategoria)) {
      console.log(`   ${categoria}: ${items.length} produto(s)`);
    }
  }
}

// 6. Promise.withResolvers() - criação simplificada de Promises - Node 22+
async function demonstratePromiseWithResolvers() {
  console.log('\n⏱️  6. Promise.withResolvers() - criação simplificada (Node 22+)');
  
  if (typeof Promise.withResolvers === 'function') {
    const { promise, resolve, reject } = Promise.withResolvers();
    
    setTimeout(() => {
      resolve('Operação concluída com sucesso!');
    }, 100);
    
    const result = await promise;
    console.log(`✅ ${result}`);
  } else {
    console.log('⚠️  Promise.withResolvers() requer Node.js 22+');
    console.log('   Fallback com new Promise():');
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Operação concluída com sucesso!');
        resolve();
      }, 100);
    });
  }
}

// 7. import.meta (disponível em ES modules)
function demonstrateImportMeta() {
  console.log('\n📁 7. import.meta - informações do módulo');
  console.log('✅ Em ES modules (.mjs ou type: module), você pode usar:');
  console.log('   - import.meta.dirname   (diretório atual) - Node 22+');
  console.log('   - import.meta.filename  (arquivo atual) - Node 22+');
  console.log('   - import.meta.url       (URL do módulo)');
}

// Execução principal
async function main() {
  console.log('🚀 Demonstração de Recursos do Node.js 22\n');
  console.log('=' .repeat(60));
  
  // Verifica versão do Node
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split('.')[0]);
  console.log(`📌 Node.js versão: ${nodeVersion}`);
  
  if (majorVersion < 22) {
    console.log('⚠️  Você está usando Node.js ' + majorVersion + ' - alguns recursos são exclusivos do Node 22+');
    console.log('💡 Atualize para Node.js 22 LTS para aproveitar todos os recursos\n');
  }
  
  try {
    await demonstrateFetch();
    demonstrateCrypto();
    demonstrateStructuredClone();
    demonstrateImmutableArrays();
    demonstrateGroupBy();
    await demonstratePromiseWithResolvers();
    demonstrateImportMeta();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Todas as demonstrações concluídas!');
    console.log('\n💡 Recursos marcados como Node 22+ funcionam com fallbacks.');
    console.log('🚀 Para experiência completa, use Node.js 22 LTS');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
