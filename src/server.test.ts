import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";
import test, { describe } from "node:test";
import expect from "node:test";
const request = supertest(app);

describe("GET /planets", () => {
    test("Valid request", async () => {
        const fruits = [
            {
                id: 1,
                name: "Watermelon",
                kg: 4,
            },
            {
                id: 2,
                name: "Apple",
                kg: 1,
            },
        ];

        // @ts-ignore
        prismaMock.fruits.findMany.mockResolvedValue(fruits);

        const response = await request
            .get("/fruits")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(fruits);
    });
});

describe("POST /fruits", () => {
    test("Valid request", async () => {
        const fruit = {
            name: "Apple",
            kg: 2,
        };

        const response = await request
            .post("/fruits")
            .send(fruit)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(fruit);
    });

    test("Invalid request", async () => {
        const fruit = {
            name: "Apple",
            kg: 2,
        };

        const response = await request
            .post("/fruits")
            .send(fruit)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});
