import express from "express";
import "express-async-errors";
import { ValidationErrorMiddleware } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";
import fruitsRoutes from "./routes/fruits";

const app = express();
app.use(express.json());

app.use(initCorsMiddleware());
app.use("/fruits", fruitsRoutes);

app.use(ValidationErrorMiddleware);

export default app;
