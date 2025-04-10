import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './server/schema.ts',
  out: './server/migrations',
  dialect: 'mysql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password : 'wh13213682290',
    database: "ssm",
  },
});