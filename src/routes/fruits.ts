import express, { Router } from "express";
import prisma from "../lib/prisma/client";
import {
    FruitsData,
    fruitsSchema,
    validate,
} from "../lib/middleware/validation";
import { initMulterMiddleware } from "../lib/middleware/multer";
import { checkAuthorization } from "../lib/middleware/passport";

const upload = initMulterMiddleware();

const router = Router();

router.get("/", async (request, response) => {
    const fruits = await prisma.fruits.findMany();
    response.json(fruits);
});

router.post(
    "/",
    checkAuthorization,
    validate({ body: fruitsSchema }),
    async (request, response) => {
        const fruitData: FruitsData = request.body;
        const username = request.user?.username as string;

        const fruit = await prisma.fruits.create({
            data: {
                ...fruitData,
                createdBy: username,
                updatedBy: username,
            },
        });
        response.status(201).json(fruit);
    }
);

router.put(
    "/id:(\\d+)",
    checkAuthorization,
    validate({ body: fruitsSchema }),
    async (request, response, next) => {
        const fruitId = Number(request.params.id);
        const fruitData: FruitsData = request.body;
        const username = request.user?.username as string;
        try {
            const fruit = await prisma.fruits.update({
                where: { id: fruitId },
                data: { ...fruitData, updatedBy: username },
            });
            response.status(200).json(fruit);
        } catch (error) {
            response.status(404);
            next(`cannot PUT /fruits/${fruitId}`);
        }
    }
);

router.delete(
    "/id:(\\d+)",
    checkAuthorization,
    async (request, response, next) => {
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
    }
);

router.post(
    "/:id(\\d+)/photo",
    checkAuthorization,
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
