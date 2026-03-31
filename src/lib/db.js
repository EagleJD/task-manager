import { neon } from '@neondatabase/serverless';

export const DATABASE_ERROR_MESSAGE =
  'DATABASE_URL 또는 POSTGRES_URL 환경변수가 설정되지 않았습니다. .env.local에 Neon 연결 문자열을 추가해 주세요.';

export function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}
