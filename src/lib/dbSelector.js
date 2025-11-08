import {
  adminPool,
  funerariaPool,
  empleadoPool,
  clientePool,
  userPool,
} from "../config/db.js";
import { AuthRepository } from "../models/AuthRepository.js";

// Map role_id values in DB to pool objects. Adjust numbers if your schema differs.
// Assumption (based on previous code): role_id === 1 => admin
// We'll assume role_id values: 1=admin, 2=funeraria, 3=empleado, 4=cliente
const rolePoolMap = {
  1: adminPool,
  2: funerariaPool,
  3: empleadoPool,
  4: clientePool,
};

export async function getPoolFor(req) {
  const sessionUser = req.session?.user;
  if (!sessionUser?.id) return userPool; // unauthenticated -> fallback

  const userId = sessionUser.id;
  const user = await AuthRepository.getUserById(userPool, userId);
  if (!user) return userPool;

  const roleId = Number(user.role_id || 0);
  return rolePoolMap[roleId] || userPool;
}
