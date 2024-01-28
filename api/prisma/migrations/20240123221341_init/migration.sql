-- CreateEnum
CREATE TYPE "Category" AS ENUM ('KITCHEN', 'BANAKU', 'PIZZA');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
