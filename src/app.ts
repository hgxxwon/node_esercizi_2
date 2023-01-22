import express, { response } from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import cors from "cors";
import {
    FruitsData,
    ValidationErrorMiddleware,
    fruitsSchema,
    validate,
} from "./lib/validation";
import { initMulterMiddleware } from "./lib/middleware/multer";
import { STATUS_CODES } from "http";

const upload = initMulterMiddleware();

const corsOptions = {
    origin: "http://localhost:8080",
};

const app = express();
app.use(express.json());

app.use(cors(corsOptions));

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

app.post(
    "/fruits/:id(\\d+)/photo",
    upload.single("photo"),
    async (request, response, next) => {
        console.log("request.file", request.file);

        if (!request.file) {
            response.status(400);
            return next("No photo file uploaded");
        }
        const photoFileName = request.file.filename;

        response.status(201).json({ photoFileName });
    }
);

app.use(ValidationErrorMiddleware);

export default app;

// controllare server.test.ts
