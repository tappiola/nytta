"use server";
import prisma from "../lib/prisma";
import { UserLocationSaved } from "@/app/ui/types";

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

export const getAmenitiesData = async () => {
  const amenitiesPromise = prisma.userChoice.findMany({
    include: {
      user: false,
    },
    orderBy: {
      district: "asc",
    },
  });

  const categoriesPromise = prisma.category.findMany();
  const subcategoriesPromise = prisma.subCategory.findMany();
  const [categories, subcategories, amenities] = await Promise.all([
    categoriesPromise,
    subcategoriesPromise,
    amenitiesPromise,
  ]);

  return amenities.map((d) => ({
    ...d,
    amenityName: /^\d+-\d+$/.test(d.amenity)
      ? categories.find((c) => d.amenity.endsWith("-" + c.id.toString()))!.name
      : subcategories.find((c) => d.amenity.endsWith(c.id.toString()))!.name,
  }));
};

export const create = async (
  categories: string[],
  userLocation: UserLocationSaved,
) => {
  console.log({ categories, userLocation });
  const userId = 1;

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

  const amenitiesToCreate = categories.map((amenity) => ({
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
