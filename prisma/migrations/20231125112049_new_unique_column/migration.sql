/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `EarData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EarData_id_key" ON "EarData"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Test_id_key" ON "Test"("id");
