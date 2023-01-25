import supertest from "supertest";
import { prismaMock } from "../lib/prisma/client.mock";
import app from "../app";

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
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");
        expect(response.body).toEqual(fruits);
    });
});

describe("POST /fruits", () => {
    test("Valid request", async () => {
        const fruit = {
            name: "Grape",
            kg: 1,
        };

        const response = await request
            .post("/fruits")
            .send(fruit)
            .expect(201)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");

        expect(response.body).toEqual(fruit);
    });

    test("Invalid request", async () => {
        const fruit = {
            name: "Grape",
            kg: 1,
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

describe("PUT /fruits/:id", () => {
    test("Valid request", async () => {
        const fruit = {
            id: 3,
            name: "Grape",
            kg: 1,
        };

        // @ts-ignore
        prismaMock.planet.update.mockResolvedValue(fruit);

        const response = await request
            .put("/fruits/3")
            .send({
                name: "Grape",
                kg: 1,
            })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");

        expect(response.body).toEqual(fruit);
    });

    test("Invalid request", async () => {
        const fruit = {
            kg: 1,
        };

        const response = await request
            .put("/fruits/23")
            .send(fruit)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
    test("Fruit does not exist", async () => {
        // @ts-ignore
        prismaMock.fruit.update.mockRejectedValue(new Error("error"));

        const response = await request
            .put("/fruits/23")
            .send({
                name: "Grape",
                kg: 1,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /fruits/23");
    });

    test("Invalid fruit id", async () => {
        const response = await request
            .put("/fruits/asdf")
            .send({
                name: "Grape",
                kg: 1,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /fruits/asdf");
    });
});

describe("DELETE", () => {
    test("Valid request", async () => {
        const response = await request
            .delete("/fruits/1")
            .expect(204)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");

        expect(response.text).toEqual("");
    });

    test("Fruit does not exist", async () => {
        // @ts-ignore
        prismaMock.fruit.update.mockRejectedValue(new Error("error"));
        const response = await request
            .delete("/fruits/30")
            .expect(404)
            .expect("Content-type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /fruits/30");
    });

    test("Invalid fruit id", async () => {
        const response = await request
            .delete("/fruits/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /fruits/asdf");
    });
});

describe("POST /fruits/:id/photo", () => {
    test("Valid request with PNG file upload", async () => {
        await request
            .post("/fruits/30/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");
    });

    test("Invalid fruit id", async () => {
        const response = await request
            .post("/fruits/asdf/photo")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /fruits/asdf/photo");
    });

    test("Invalid request with no file uploaded", async () => {
        const response = await request
            .post("/fruits/30/photo")
            .expect(400)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("No photo file uploaded");
    });
});
