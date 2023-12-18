/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Room` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 8,
    "isActive" BOOLEAN NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Room" ("amount", "code", "createdDate", "id", "isActive", "updatedDate") SELECT "amount", "code", "createdDate", "id", "isActive", "updatedDate" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_code_key" ON "Room"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
