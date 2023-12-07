-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uid" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarData" (
    "frequency" INTEGER NOT NULL,
    "pitch" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "testId2" TEXT NOT NULL,

    CONSTRAINT "EarData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Test_uid_key" ON "Test"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Test_url_key" ON "Test"("url");

-- CreateIndex
CREATE UNIQUE INDEX "EarData_testId_key" ON "EarData"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "EarData_testId2_key" ON "EarData"("testId2");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarData" ADD CONSTRAINT "EarData_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarData" ADD CONSTRAINT "EarData_testId2_fkey" FOREIGN KEY ("testId2") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
