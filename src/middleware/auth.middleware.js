import pool from "../config/db.js";
import UsersRepository from "../models/usersRepository.js";

// Middleware para verificar si el usuario está autenticado
export const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = req?.session?.user?.id;
      console.log("User ID:", user);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      let role;
      if (req.session.user.role) {
        role = req.session.user.role;
      } else {
        const user = await UsersRepository.findById(
          pool,
          req?.session?.user?.id
        );
        role = user.role;
        req.session.user.role = role;
      }
      console.log("User role:", role);
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (err) {
      console.error("Authorization error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    next();
  };
};
