/*
  Warnings:

  - A unique constraint covering the columns `[shop]` on the table `active_stores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "active_stores_shop_key" ON "active_stores"("shop");
