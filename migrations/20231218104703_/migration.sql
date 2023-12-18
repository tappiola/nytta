/*
  Warnings:

  - You are about to drop the column `amenity` on the `UserChoice` table. All the data in the column will be lost.
  - Added the required column `amenityId` to the `UserChoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserChoice" DROP CONSTRAINT "UserChoice_amenity_fkey";

-- AlterTable
ALTER TABLE "UserChoice" DROP COLUMN "amenity",
ADD COLUMN     "amenityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserChoice" ADD CONSTRAINT "UserChoice_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
