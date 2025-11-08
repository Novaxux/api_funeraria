import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
export const SESSION_SECRET = process.env.SESSION_SECRET || "keyboard cat";
