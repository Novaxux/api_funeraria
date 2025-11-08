import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";

import { PORT, CORS_ORIGIN, SESSION_SECRET } from "./config/config.js";

// Enrutador principal
import apiRoutes from "./routes/api.routes.js";

// Middlewares
// import { attachUser } from "./middlewares/auth.middleware.js"; // Descomentar cuando se implemente JWT

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// --- Configuración de sesión (opcional, puede ser útil para web) ---
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // cambia a true si usas HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

// --- Adjunta usuario autenticado a req.user ---
// app.use(attachUser); // Descomentar cuando se implemente JWT

// --- Rutas ---
app.use("/api", apiRoutes);

// --- Servidor ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
