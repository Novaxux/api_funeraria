import express from "express";
// import cors from "cors";
import morgan from "morgan";
import sessionMiddleware from "./middleware/session.middleware.js";

// import { PORT, CORS_ORIGIN } from "./config/config.js";
import { PORT } from "./config/config.js";

// Enrutador principal
import apiRoutes from "./routes/api.routes.js";

// Middlewares
const app = express();
app.use(morgan("dev"));
app.use(express.json());
// app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// --- Configuración de sesión (opcional, puede ser útil para web) ---
app.use(sessionMiddleware);

// --- Rutas ---
app.use("/api", apiRoutes);

// --- Servidor ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
