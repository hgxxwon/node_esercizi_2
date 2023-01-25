import express, { Router } from "express";
import prisma from "../lib/prisma/client";
import {
    FruitsData,
    fruitsSchema,
    validate,
} from "../lib/middleware/validation";
import { initMulterMiddleware } from "../lib/middleware/multer";

const upload = initMulterMiddleware();

const router = Router();

router.get("/", async (request, response) => {
    const fruits = await prisma.fruits.findMany();
    response.json(fruits);
});

router.post(
    "/",
    validate({ body: fruitsSchema }),
    async (request, response) => {
        const fruit: FruitsData = request.body;
        response.status(201).json(fruit);
    }
);

router.put(
    "/id:(\\d+)",
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

router.delete("/id:(\\d+)", async (request, response, next) => {
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

router.post(
    "/:id(\\d+)/photo",
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

export default router;
