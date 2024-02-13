export type ServiceSpot = {
  id: number;
  name: string;
  placeId: string;
  addressLine1: string;
  addressLine2?: string;
  coords: Coordinate;
  priceRateImage: string;
  serviceSpotImages: string[];
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type GetNearbyServiceSpotsParams = {
  lat: number;
  lng: number;
  radius: number;
};
