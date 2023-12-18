import { Prisma } from "@prisma/client";
import { getAmenitiesData, getCategories } from "@/app/lib/actions";

export interface UserLocation {
  shortName?: string;
  longName?: string;
  locality?: string;
  postcode?: string;
  neighborhood?: string;
  place?: string;
  district?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserLocationSaved extends UserLocation {
  latitude: number;
  longitude: number;
}
export type Categories = Prisma.PromiseReturnType<typeof getCategories>;
export type Category = Categories[number];

export type AmenityCategory = {
  name: string;
  id: number;
  parentId: number | null;
};

export type Amenities = Prisma.PromiseReturnType<typeof getAmenitiesData>;
export type Amenity = Amenities[number] & {
  amenity: AmenityCategory;
};
