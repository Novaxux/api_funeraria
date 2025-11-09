import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.MYSQL_ROOT_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

export default pool;
