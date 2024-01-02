/*
  Warnings:

  - Added the required column `isActive` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qrCode" BLOB NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 8,
    "isActive" BOOLEAN NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Room" ("amount", "code", "createdDate", "id", "qrCode", "updatedDate") SELECT "amount", "code", "createdDate", "id", "qrCode", "updatedDate" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_qrCode_key" ON "Room"("qrCode");
CREATE UNIQUE INDEX "Room_code_key" ON "Room"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
