/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `RoomCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoomCode_code_key" ON "RoomCode"("code");
