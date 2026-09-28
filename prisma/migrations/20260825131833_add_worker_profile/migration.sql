-- CreateTable
CREATE TABLE "WorkerProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "profession" TEXT NOT NULL,
    "bio" TEXT,
    "experience" INTEGER NOT NULL,
    "hourlyRate" DOUBLE PRECISION,
    "city" TEXT NOT NULL,
    "serviceRadius" INTEGER NOT NULL DEFAULT 10,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalJobs" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerProfile_userId_key" ON "WorkerProfile"("userId");

-- AddForeignKey
ALTER TABLE "WorkerProfile" ADD CONSTRAINT "WorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
