import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { globalRateLimiter } from "./middleware/rate-limit.middleware";
import { securityHeadersMiddleware } from "./middleware/security-headers.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { generateCsrfToken, verifyCsrfToken } from "./middleware/csrf.middleware";

const app = express();

// Security Headers
app.use(helmet());
app.use(securityHeadersMiddleware);

// CORS Config
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Required for HttpOnly cookies and CSRF
}));

// Body & Cookie Parsing
app.use(express.json({ limit: "10kb" })); // Prevents large payload abuse
app.use(cookieParser());

// Rate Limiting
app.use(globalRateLimiter);

import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import managerRoutes from "./modules/manager/manager.routes";

// Setup CSRF token for the session
app.use(generateCsrfToken);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);

// Health check doesn't need strict verification
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Example of a protected route using CSRF
app.post("/api/secure-action", verifyCsrfToken, (req, res) => {
    res.json({ message: "Action permitted" });
});

// Global Error Handler
app.use(errorHandler);

export default app;
