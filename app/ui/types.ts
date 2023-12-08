export interface UserLocation {
  shortName?: string;
  longName?: string;
  locality?: string;
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
