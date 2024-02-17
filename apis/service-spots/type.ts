import { Driver } from "../drivers/type";
import { SubDistrict } from "../shared/type";

export type ServiceSpot = {
  id: number;
  name: string;
  placeId: string;
  addressLine1: string;
  addressLine2?: string;
  address: SubDistrict;
  coords: Coordinate;
  priceRateImageUrl: string;
  serviceSpotOwner: Driver;
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type GetNearbyServiceSpotsParams = Coordinate & {
  radius: number;
};
