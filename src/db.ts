import * as schema from '@/server/schema';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const connection = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password : 'wh13213682290',
  database: "ssm",
  waitForConnections: true,
  multipleStatements: true,
});
export const db = drizzle(connection,{schema,mode:'default'});