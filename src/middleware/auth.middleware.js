import pool from "../config/db.js";
import UsersRepository from "../models/usersRepository.js";

export const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const sessionUser = req?.session?.user;

      if (!sessionUser || !sessionUser.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Asegurar que req.user exista
      req.user = req.user || {};

      let role = sessionUser.role;
      let funeralHomeId = sessionUser.id_funeral_home;

      // Si falta info, se trae desde BD
      if (!role || !funeralHomeId) {
        const dbUser = await UsersRepository.findById(pool, sessionUser.id);

        if (!dbUser) {
          return res.status(401).json({ message: "User not found" });
        }

        role = dbUser.role;
        funeralHomeId = dbUser.id_funeral_home;

        // Actualizar sesión
        req.session.user.role = role;
        req.session.user.id_funeral_home = funeralHomeId;
      }

      // Actualizar req.user para accesos posteriores
      req.user.role = role;
      req.user.id_funeral_home = funeralHomeId;

      console.log("User role:", role);
      console.log("Funeral home ID:", funeralHomeId);

      // Validar rol permitido
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      console.error("Authorization error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
