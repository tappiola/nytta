"use server";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
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

export const getUserAmenities = async (userId: string) => {
  return prisma.userChoice.findMany({
    where: {
      userId,
    },
  });
};

export const getAmenitiesData = async () => {
  const amenitiesPromise = prisma.userChoice.findMany({
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
  categories: TreeCheckboxSelectionKeys,
  userLocation: UserLocationSaved,
  userId: string,
) => {
  const categoriesKeys = Object.keys(categories)
    .filter((key) => categories[key].checked)
    .map((key) => key);

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
    amenity,
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
    console.log(`Amenities created successfully`);
  } catch (error) {
    console.error(`Error creating amenities:`, error);
  }
};
