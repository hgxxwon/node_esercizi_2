import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";

const app = express();

app.get("/fruits", async (request, response) => {
    const fruits = await prisma.fruits.findMany();
    response.json(fruits);
});

export default app;

// controllare server.test.ts
