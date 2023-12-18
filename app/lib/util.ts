import { Prisma } from "@prisma/client";
import { getCategories } from "@/app/lib/actions";

type Amenities = Prisma.PromiseReturnType<typeof getCategories>;

type A2 = {
  name: string;
  id: string;
  parentId: number | null;
  childrenCount: number;
};
export const createTree = (
  items: Amenities,
  parentId: number | null = null,
): A2[] =>
  items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      key: item.id,
      id: item.id.toString(),
      label: item.name,
      children: createTree(items, item.id),
    }));

export const removeNullUndefined = <T extends Record<string, any>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  ) as T;
