import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import {
    FruitsData,
    ValidationErrorMiddleware,
    fruitsSchema,
    validate,
} from "./lib/validation";

const app = express();
app.use(express.json());

app.get("/fruits", async (request, response) => {
    const fruits = await prisma.fruits.findMany();
    response.json(fruits);
});

app.post(
    "/fruits",
    validate({ body: fruitsSchema }),
    async (request, response) => {
        const fruit: FruitsData = request.body;
        response.status(201).json(fruit);
    }
);

app.use(ValidationErrorMiddleware);

export default app;

// controllare server.test.ts
