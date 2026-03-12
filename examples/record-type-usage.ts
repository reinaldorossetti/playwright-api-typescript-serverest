/**
 * Demonstração do uso de Record<K, V> em testes de API
 * Execute com: node examples/record-type-usage.ts
 * 
 * Nota: Este é um arquivo JavaScript com JSDoc para funcionar sem compilação
 * Record<K, V> é um recurso do TypeScript, mas os conceitos se aplicam aqui
 */

// 1. Headers HTTP dinâmicos
function demonstrateHeaders() {
  console.log('\n📨 1. Headers HTTP com Record<string, string>');
  
  /** @type {Record<string, string>} - Em TS seria: Record<string, string> */
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token-123',
    'X-Request-ID': crypto.randomUUID(),
    'X-API-Version': 'v1'
  };
  
  console.log('✅ Headers criados (tipo seria Record<string, string>):');
  for (const [key, value] of Object.entries(headers)) {
    console.log(`   ${key}: ${value}`);
  }
}

// 2. Validação de erros da API
function demonstrateValidationErrors() {
  console.log('\n❌ 2. Erros de validação com Record<string, string>');
  
  /** @type {Record<string, string>} */
  // Simula resposta de erro da API
  const apiErrorResponse = {
    email: 'email deve ser um email válido',
    password: 'password é obrigatório',
    nome: 'nome deve ter no mínimo 3 caracteres'
  };
  
  console.log('✅ Erros da API (tipo seria Record<string, string>):');
  for (const [field, error] of Object.entries(apiErrorResponse)) {
    console.log(`   Campo "${field}": ${error}`);
  }
}

// 3. Query parameters dinâmicos
function demonstrateQueryParams() {
  console.log('\n🔍 3. Query parameters com Record<string, string>');
  
  /** @type {Record<string, string>} */
  const filters = {
    nome: 'Mouse',
    'preco_min': '50',
    'preco_max': '200',
    categoria: 'Periféricos',
    _sort: 'preco',
    _limit: '10'
  };
  
  const queryString = new URLSearchParams(filters).toString();
  const url = `https://serverest.dev/produtos?${queryString}`;
  
  console.log('✅ URL gerada (tipo seria Record<string, string>):');
  console.log(`   ${url}`);
}

// 4. Mapeamento de status codes
function demonstrateStatusMapping() {
  console.log('\n📊 4. Mapeamento de status codes');
  
  /** @type {Record<number, string>} */
  const statusMessages = {
    200: 'OK - Requisição bem-sucedida',
    201: 'Created - Recurso criado com sucesso',
    400: 'Bad Request - Dados inválidos',
    401: 'Unauthorized - Token ausente ou inválido',
    403: 'Forbidden - Acesso negado',
    404: 'Not Found - Recurso não encontrado',
    500: 'Internal Server Error - Erro no servidor'
  };
  
  const testStatuses = [200, 201, 404, 500];
  
  console.log('✅ Mensagens por status (tipo seria Record<number, string>):');
  for (const status of testStatuses) {
    console.log(`   ${status}: ${statusMessages[status]}`);
  }
}

// 5. Configurações dinâmicas de ambiente
function demonstrateEnvironmentConfig() {
  console.log('\n⚙️  5. Configurações de ambiente');
  
  /** @type {Record<string, string>} */
  const envConfig = {
    API_BASE_URL: 'https://serverest.dev',
    DEFAULT_USER_PASSWORD: 'SenhaSegura@123',
    DEFAULT_TIMEOUT: '30000',
    LOG_LEVEL: 'debug',
    RETRY_ATTEMPTS: '3'
  };
  
  console.log('✅ Configurações carregadas (tipo seria Record<string, string>):');
  for (const [key, value] of Object.entries(envConfig)) {
    console.log(`   ${key}=${value}`);
  }
}

// 6. Cache de tokens por usuário
function demonstrateTokenCache() {
  console.log('\n🔐 6. Cache de tokens de autenticação');
  
  /** @type {Record<string, string>} */
  const tokenCache = {
    'admin@test.com': 'Bearer eyJhbGc...',
    'user1@test.com': 'Bearer xyzAbc...',
    'user2@test.com': 'Bearer qwerty...'
  };
  
  const email = 'admin@test.com';
  const token = tokenCache[email];
  
  console.log(`✅ Token para ${email} (tipo seria Record<string, string>):`);
  console.log(`   ${token}`);
  console.log(`\n✅ Total de tokens em cache: ${Object.keys(tokenCache).length}`);
}

// 7. Comparação: Record vs Interface
function demonstrateRecordVsInterface() {
  console.log('\n🆚 7. Quando usar Record vs Interface');
  
  // ✅ Use Record quando as chaves são dinâmicas/desconhecidas
  /** @type {Record<string, string>} */
  const dynamicErrors = {
    email: 'inválido',
    password: 'muito curto'
    // Pode ter mais campos que não sabemos em tempo de desenvolvimento
  };
  
  // ✅ Use Interface quando as chaves são conhecidas e fixas
  // Em TypeScript seria: interface LoginResponse { authorization: string; message: string; }
  const loginResponse = {
    authorization: 'Bearer token123',
    message: 'Login realizado com sucesso'
  };
  
  console.log('✅ Record<string, string> (chaves dinâmicas):');
  console.log(`   Erros: ${JSON.stringify(dynamicErrors)}`);
  
  console.log('\n✅ Interface (contrato fixo):');
  console.log(`   Login: ${JSON.stringify(loginResponse)}`);
  
  console.log('\n💡 Regra de ouro em TypeScript:');
  console.log('   - Record<K, V> → chaves dinâmicas ou desconhecidas');
  console.log('   - Interface → chaves fixas e conhecidas (melhor autocomplete)');
}

// 8. Uso avançado: Record com union types
function demonstrateAdvancedRecord() {
  console.log('\n🚀 8. Uso avançado: Record com union types');
  
  // Em TypeScript: type Environment = 'development' | 'staging' | 'production';
  // const apiUrls: Record<Environment, string> = { ... }
  
  /** @type {Record<string, string>} */
  const apiUrls = {
    development: 'http://localhost:3000',
    staging: 'https://staging.serverest.dev',
    production: 'https://serverest.dev'
  };
  
  const env = 'production';
  console.log(`✅ URL para ambiente "${env}": ${apiUrls[env]}`);
  
  console.log('\n✅ Todas as URLs configuradas:');
  for (const [environment, url] of Object.entries(apiUrls)) {
    console.log(`   ${environment}: ${url}`);
  }
  
  console.log('\n💡 Em TypeScript com union type:');
  console.log('   type Environment = "development" | "staging" | "production";');
  console.log('   const apiUrls: Record<Environment, string> = { ... }');
  console.log('   TypeScript garante que todas as chaves estejam presentes!');
}

// Execução principal
async function main() {
  console.log('🚀 Demonstração de Record<K, V> no TypeScript\n');
  console.log('=' .repeat(60));
  
  try {
    demonstrateHeaders();
    demonstrateValidationErrors();
    demonstrateQueryParams();
    demonstrateStatusMapping();
    demonstrateEnvironmentConfig();
    demonstrateTokenCache();
    demonstrateRecordVsInterface();
    demonstrateAdvancedRecord();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Todas as demonstrações concluídas!');
    console.log('\n💡 Record<K, V> é perfeito para objetos com chaves dinâmicas.');
    console.log('🎯 Disponível desde TypeScript 2.1 (2016) - funciona em qualquer Node.js!');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

main();
