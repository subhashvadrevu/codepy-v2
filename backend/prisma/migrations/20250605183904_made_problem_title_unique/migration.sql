/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `List` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "List_name_key" ON "List"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_key" ON "Problem"("title");
