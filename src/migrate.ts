// import 'dotenv/config';
// import { migrate } from 'drizzle-orm/mysql2/migrator';
// import { db, connection} from './db';
// // 这将在数据库上运行迁移，跳过已应用的迁移
// migrate(db, { migrationsFolder: './server/migrations' });
// // 不要忘记关闭连接，否则脚本将挂起
// connection.end();

import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, connection } from './db';

async function runMigrations() {
  try {
    // 这将在数据库上运行迁移，跳过已应用的迁移
    await migrate(db, { migrationsFolder: './server/migrations' });
    console.log('Migrations executed successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1); // 退出脚本，返回状态码 1
  } finally {
    // 确保在操作完成后关闭连接
    if (connection) {
      await connection.end();
    }
  }
}

runMigrations();