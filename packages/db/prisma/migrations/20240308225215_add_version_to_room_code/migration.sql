-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoomCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_RoomCode" ("code", "createdDate", "id", "isActive", "updatedDate") SELECT "code", "createdDate", "id", "isActive", "updatedDate" FROM "RoomCode";
DROP TABLE "RoomCode";
ALTER TABLE "new_RoomCode" RENAME TO "RoomCode";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
