/**
 * Carregamento e validação de variáveis de ambiente.
 *
 * Usa process.loadEnvFile() — API nativa do Node.js 22.4+ (sem dependência dotenv).
 * Todas as variáveis são OBRIGATÓRIAS; senhas nunca ficam no código-fonte.
 * Crie um arquivo .env na raiz do projeto com base em .env.example.
 */

// Carrega o .env da raiz do projeto de forma nativa (Node.js 22.4+)
try {
  process.loadEnvFile();
} catch {
  // Silencia erro em ambientes CI/CD onde as variáveis já estão injetadas no processo
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `[env] A variável de ambiente "${name}" é obrigatória mas não foi definida.\n` +
      `Crie um arquivo .env na raiz do projeto com base em .env.example.`
    );
  }
  return value.trim();
}

function requireUrl(name: string): string {
  const raw = requireEnv(name);
  try {
    new URL(raw);
  } catch {
    throw new Error(`[env] A variável "${name}" não é uma URL válida: "${raw}"`);
  }
  return raw;
}

export const env = {
  /** Senha padrão dos usuários criados nos testes — definida exclusivamente no .env */
  defaultUserPassword: requireEnv('DEFAULT_USER_PASSWORD'),
  /** URL base da API ServeRest */
  apiBaseUrl: requireUrl('API_BASE_URL'),
} as const;

export type Env = typeof env;

