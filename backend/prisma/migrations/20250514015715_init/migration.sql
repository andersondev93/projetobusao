/*
  Warnings:

  - The primary key for the `_LinhaToPonto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_LinhaToPonto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_LinhaToPonto" DROP CONSTRAINT "_LinhaToPonto_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_LinhaToPonto_AB_unique" ON "_LinhaToPonto"("A", "B");
