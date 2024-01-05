/*
  Warnings:

  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proposed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParticipantToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `title` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Action_name_key";

-- DropIndex
DROP INDEX "Room_code_key";

-- DropIndex
DROP INDEX "_ParticipantToUser_B_index";

-- DropIndex
DROP INDEX "_ParticipantToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Action";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AuditLog";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Participant";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Proposed";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Result";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Room";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vote";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ParticipantToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Lobby" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 8,
    "isActive" BOOLEAN NOT NULL,
    "movieId" TEXT NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lobby_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "runtime" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "ratingId" TEXT NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Movie_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Movie" ("createdDate", "date", "description", "id", "imageAlt", "imageSrc", "location", "ratingId", "runtime", "score") SELECT "createdDate", "date", "description", "id", "imageAlt", "imageSrc", "location", "ratingId", "runtime", "score" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_code_key" ON "Lobby"("code");
