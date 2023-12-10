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
