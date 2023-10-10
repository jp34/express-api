import { PlaceLocation } from "../entity/place"
import { Geocode } from "../entity/geo"

export interface CreatePlacePayload {
    name: string
    tags: string[]
    location: PlaceLocation
    geocode: Geocode
    refId: string
}

export interface PlaceSearchParams {
    _id?: string
    name: string
    
}