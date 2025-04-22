/*
  Warnings:

  - You are about to drop the `Limitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WarningMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Limitation" DROP CONSTRAINT "Limitation_shopId_fkey";

-- DropForeignKey
ALTER TABLE "WarningMessage" DROP CONSTRAINT "WarningMessage_shopId_fkey";

-- DropTable
DROP TABLE "Limitation";

-- DropTable
DROP TABLE "WarningMessage";

-- CreateTable
CREATE TABLE "limitation" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "limitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warningMessage" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "minMessage" TEXT,
    "maxMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warningMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "limitation_shopId_itemId_type_key" ON "limitation"("shopId", "itemId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "warningMessage_shopId_key" ON "warningMessage"("shopId");

-- AddForeignKey
ALTER TABLE "limitation" ADD CONSTRAINT "limitation_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warningMessage" ADD CONSTRAINT "warningMessage_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
