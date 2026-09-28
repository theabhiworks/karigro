-- CreateTable
CREATE TABLE "WorkerService" (
    "id" SERIAL NOT NULL,
    "workerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkerService_workerId_idx" ON "WorkerService"("workerId");

-- AddForeignKey
ALTER TABLE "WorkerService" ADD CONSTRAINT "WorkerService_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "WorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
