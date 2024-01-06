-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lobby" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 8,
    "isActive" BOOLEAN NOT NULL,
    "movieId" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lobby_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Lobby" ("amount", "code", "createdDate", "id", "isActive", "movieId", "updatedDate") SELECT "amount", "code", "createdDate", "id", "isActive", "movieId", "updatedDate" FROM "Lobby";
DROP TABLE "Lobby";
ALTER TABLE "new_Lobby" RENAME TO "Lobby";
CREATE UNIQUE INDEX "Lobby_code_key" ON "Lobby"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
