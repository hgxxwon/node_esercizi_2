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

app.put(
    "/fruits/id:(\\d+)",
    validate({ body: fruitsSchema }),
    async (request, response, next) => {
        const fruitId = Number(request.params.id);
        const fruitData: FruitsData = request.body;
        try {
            const fruit = await prisma.fruits.update({
                where: { id: fruitId },
                data: fruitData,
            });
            response.status(200).json(fruit);
        } catch (error) {
            response.status(404);
            next(`cannot PUT /fruits/${fruitId}`);
        }
    }
);

app.delete("/fruits/id:(\\d+)", async (request, response, next) => {
    const fruitId = Number(request.params.id);
    try {
        await prisma.fruits.delete({
            where: { id: fruitId },
        });
        response.status(200).end();
    } catch (error) {
        response.status(404);
        next(`cannot DELETE /fruits/${fruitId}`);
    }
});

app.use(ValidationErrorMiddleware);

export default app;

// controllare server.test.ts
