-- CreateTable
CREATE TABLE "RoomCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);