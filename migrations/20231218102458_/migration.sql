/*
  Warnings:

  - Changed the type of `amenity` on the `UserChoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserChoice" DROP COLUMN "amenity",
ADD COLUMN     "amenity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserChoice" ADD CONSTRAINT "UserChoice_amenity_fkey" FOREIGN KEY ("amenity") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
