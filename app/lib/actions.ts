"use server";
import prisma from "../lib/prisma";
import { UserLocation, UserLocationSaved } from "@/app/ui/types";

export const getCategories = async () => {
  return prisma.topCategory.findMany({
    include: {
      categories: {
        include: {
          SubCategory: {
            orderBy: {
              name: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const create = async (
  categories: string[],
  userLocation: UserLocationSaved,
) => {
  console.log({ categories, userLocation });
  const userId = 1; // Assuming a user with ID 1

  const amenitiesToCreate = categories.map((amenity) => ({
    ...userLocation,
    amenity,
    userId,
  }));

  try {
    await prisma.userChoice.createMany({ data: amenitiesToCreate });
    console.log(`Amenities created successfully`);
  } catch (error) {
    console.error(`Error creating amenities:`, error);
  }
};
