import express from "express";
import "express-async-errors";
import { ValidationErrorMiddleware } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";
import passport from "passport";
import fruitsRoutes from "./routes/fruits";
import { initSessionMiddleware } from "./lib/middleware/session";
import authRoutes from "./routes/auth";

const app = express();

app.use(initSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(initCorsMiddleware());
app.use("/fruits", fruitsRoutes);
app.use("/auth", authRoutes);

app.use(ValidationErrorMiddleware);

export default app;
