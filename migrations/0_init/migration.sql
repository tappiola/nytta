-- CreateTable
CREATE TABLE "Amenity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChoice" (
    "id" SERIAL NOT NULL,
    "shortName" TEXT,
    "longName" TEXT,
    "district" TEXT,
    "place" TEXT,
    "postcode" TEXT,
    "region" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "locality" TEXT,
    "partiallySelected" BOOLEAN NOT NULL DEFAULT false,
    "amenityId" INTEGER NOT NULL,

    CONSTRAINT "UserChoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserChoice" ADD CONSTRAINT "UserChoice_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

