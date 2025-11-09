import usersRepository from "../models/usersRepository.js";
import pool from "../config/db.js";

// Middleware para adjuntar usuario autenticado a req.user
export const attachUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await usersRepository.findById(pool, req.session.userId);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error("Error attaching user:", error);
    next();
  }
};

// Middleware para verificar si el usuario está autenticado
export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Authentication required." });
  }
  next();
};
