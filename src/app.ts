import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";

const app = express();
app.use(express.json());

const hello = "ciao";
console.log(hello);

export default app;
