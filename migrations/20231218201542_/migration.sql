/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_topCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_parentCategoryId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "SubCategory";

-- DropTable
DROP TABLE "TopCategory";
