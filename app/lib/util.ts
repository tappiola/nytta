import { Prisma } from "@prisma/client";
import { getCategories } from "@/app/lib/actions";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { Categories } from "@/app/ui/types";

type Amenities = Prisma.PromiseReturnType<typeof getCategories>;

export type TreeNode = {
  name: string;
  id: string;
  parentId: number | null;
  childrenCount: number;
  children?: TreeNode[];
};
export const createTree = (
  items: Amenities,
  parentId: number | null = null,
): TreeNode[] =>
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

export const extractIdsFromTree = (node: TreeNode): Number[] => {
  const ids: Number[] = [+node.id];

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      const childIds = extractIdsFromTree(child);
      ids.push(...childIds);
    });
  }

  return ids;
};

export const getCategoriesNames = (
  categories: Categories,
  selectedCategories: TreeCheckboxSelectionKeys,
) => {
  const categoriesKeys = Object.keys(selectedCategories)
    .filter(
      (key) =>
        selectedCategories[key].checked &&
        categories.find(({ id }) => id === +key)?.childrenCount === 0,
    )
    .map((key) => key);

  return categories
    .filter(({ id }) => categoriesKeys.includes(id.toString()))
    .map(({ name }) => name);
};
