-- CreateTable
CREATE TABLE "Fruits" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "kg" INTEGER NOT NULL,

    CONSTRAINT "Fruits_pkey" PRIMARY KEY ("id")
);
