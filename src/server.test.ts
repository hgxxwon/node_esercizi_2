import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";

const request = supertest(app);

test("GET /fruits", async () => {
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
    // questi due oggetti si trovano anche nel db di prisma studio, però li ho messi a mano per mostrare la procedura

    // @ts-ignore
    prismaMock.fruits.findMany.mockResolvedValue(fruits);

    const response = await request
        .get("/fruits")
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(fruits);
});
