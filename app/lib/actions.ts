"use server";
import prisma from "../lib/prisma";

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
