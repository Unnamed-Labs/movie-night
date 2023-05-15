/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_name_key" ON "Rating"("name");
