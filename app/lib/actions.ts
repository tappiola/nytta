"use server";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import prisma from "../lib/prisma";
import { UserLocationSaved } from "@/app/ui/types";
import { revalidatePath } from "next/cache";

export const getCategories = async () => {
  const amenities = await prisma.amenity.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Promise.all(
    amenities.map(async (amenity) => {
      const childrenCount = await prisma.amenity.count({
        where: {
          parentId: amenity.id,
        },
      });

      return {
        ...amenity,
        childrenCount,
      };
    }),
  );
};

export const getUserAmenities = async (userId: string) => {
  return prisma.userChoice.findMany({
    where: {
      userId,
    },
  });
};

export const getAmenitiesData = async () => {
  return prisma.userChoice.findMany({
    select: {
      amenity: true,
      locality: true,
      district: true,
      place: true,
      neighborhood: true,
      postcode: true,
      latitude: true,
      longitude: true,
    },
    where: {
      partiallySelected: false,
    },
    orderBy: {
      district: "asc",
    },
  });
};

export const create = async (
  categories: TreeCheckboxSelectionKeys,
  userLocation: UserLocationSaved,
  userId: string,
) => {
  const {
    shortName,
    longName,
    locality,
    postcode,
    neighborhood,
    place,
    district,
    region,
    country,
    longitude,
    latitude,
  } = userLocation;

  const amenitiesToCreate = Object.keys(categories).map((amenity) => ({
    latitude,
    longitude,
    shortName,
    longName,
    locality,
    postcode,
    neighborhood,
    place,
    district,
    region,
    country,
    amenityId: +amenity,
    userId,
    partiallySelected: categories[amenity].partialChecked,
  }));

  try {
    await prisma.userChoice.deleteMany({
      where: {
        userId,
      },
    });
    await prisma.userChoice.createMany({ data: amenitiesToCreate });
    revalidatePath("/insights");
    console.log(`Amenities created successfully`);
  } catch (error) {
    console.error(`Error creating amenities:`, error);
  }
};
