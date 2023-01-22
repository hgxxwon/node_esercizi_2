module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbode: true,
    clearMocks: true,
    setupFilesAfterEnv: [
        "./src/lib/prisma/client.mock.ts",
        "./src/lib/middleware/multer.mock.ts",
    ],
};
