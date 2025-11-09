import session from "express-session";
import { SESSION_SECRET } from "../config/config.js";

const sessionConfig = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // cambia a true si usas HTTPS
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 día
  },
});

export default sessionConfig;
