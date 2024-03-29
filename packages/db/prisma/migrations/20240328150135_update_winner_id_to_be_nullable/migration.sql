-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Winner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "image" TEXT,
    "lobbyId" TEXT NOT NULL,
    "winnerId" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Winner_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Winner_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Winner" ("createdDate", "id", "image", "lobbyId", "name", "winnerId") SELECT "createdDate", "id", "image", "lobbyId", "name", "winnerId" FROM "Winner";
DROP TABLE "Winner";
ALTER TABLE "new_Winner" RENAME TO "Winner";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
