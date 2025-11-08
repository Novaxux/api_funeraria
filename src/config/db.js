// import mysql from "mysql2/promise";
// import { config } from "dotenv";

// config();

// // Create multiple pools for different DB users/roles.
// // Environment variables used as fallback; sensible defaults provided for local dev.
// const DB_HOST = process.env.DB_HOST;
// const DB_PORT = process.env.DB_PORT;
// const DB_NAME = process.env.DB_NAME;

// // =============================================
// // FUNCIÓN GENERADORA DE POOLS
// // =============================================
// function makePool(user, password) {
// 	return mysql.createPool({
// 		host: "mysql",
// 		port: 3306,
// 		user:"root",
// 		password:"root",
// 		database: "funeraria_db",
// 		waitForConnections: true,
// 		connectionLimit: 10,
// 		queueLimit: 0,
// 		namedPlaceholders: true, // opcional: permite usar :param en consultas
// 	});
// }

// // =============================================
// // POOLS POR ROL / USUARIO
// // =============================================
// export const adminPool = makePool(
// 	process.env.DB_ADMIN_USER || "admin_funeraria",
// 	process.env.DB_ADMIN_PASS || "Admin123!"
// );

// export const funerariaPool = makePool(
// 	process.env.DB_FUNERARIA_USER || "funeraria_user",
// 	process.env.DB_FUNERARIA_PASS || "Funeraria123!"
// );

// export const empleadoPool = makePool(
// 	process.env.DB_EMPLEADO_USER || "empleado_user",
// 	process.env.DB_EMPLEADO_PASS || "Empleado123!"
// );

// export const clientePool = makePool(
// 	process.env.DB_CLIENTE_USER || "cliente_user",
// 	process.env.DB_CLIENTE_PASS || "Cliente123!"
// );

// // =============================================
// // POOL POR DEFECTO (ADMIN)
// // =============================================
// // Se usa para migraciones, autenticación o endpoints públicos
// export const userPool = adminPool;

// // =============================================
// // OTRAS CONFIGURACIONES DEL SERVIDOR
// // =============================================
// export const PORT = process.env.PORT || 3000;
// export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
// export const SESSION_SECRET = process.env.SESSION_SECRET || "keyboard cat";

// // =============================================
// // PRUEBA OPCIONAL DE CONEXIÓN (puedes comentar)
// // =============================================
// (async () => {
// 	try {
// 		const conn = await adminPool.getConnection();
// 		console.log("✅ Conexión a la base de datos exitosa:", DB_NAME);
// 		conn.release();
// 	} catch (err) {
// 		console.error("❌ Error al conectar con la base de datos:", err.message);
// 	}
// })();

import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.MYSQL_ROOT_USER || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

export default pool;