import express from "express";
import cors from "cors";
import morgan from "morgan";
import sessionMiddleware from "./middleware/session.middleware.js";

import { PORT, CORS_ORIGIN } from "./config/config.js";

// Enrutador principal
import apiRoutes from "./routes/api.routes.js";

// Middlewares
// import { attachUser } from "./middlewares/auth.middleware.js"; // Descomentar cuando se implemente JWT

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// --- Configuración de sesión (opcional, puede ser útil para web) ---
app.use(sessionMiddleware);

// --- Adjunta usuario autenticado a req.user ---
// app.use(attachUser); // Descomentar cuando se implemente JWT

// --- Rutas ---
app.use("/api", apiRoutes);

// --- Servidor ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
