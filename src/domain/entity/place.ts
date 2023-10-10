import { v4 } from "uuid";
import mongoose, { Schema } from "mongoose";
import { Geocode } from "./geo";

export interface PlaceLocation {
    address: string
    address2: string
    locality: string
    region: string
    postcode: string
    country: string
    formatted: string
}

export interface Place {
    _id: string
    name: string
    tags: string[]
    location: PlaceLocation
    geocode: Geocode
    refId: string
    dateCreated: Date
    dateModified: Date
}

export const PlaceSchema = new Schema<Place>({
    _id: { type: String, default: v4 },
    name: { type: String, required: true },
    tags: { type: [], default: [] },
    location: {
        address: { type: String, required: true },
        address2: { type: String, default: "" },
        locality: { type: String, required: true },
        region: { type: String, required: true },
        postcode: { type: String, required: true },
        country: { type: String, required: true },
        formatted: { type: String, required: true }
    },
    geocode: {
        latitude: { type: String, required: true },
        longitude: { type: String, required: true }
    },
    refId: { type: String, default: "" },
    dateCreated: { type: Date, default: Date.now() },
    dateModified: { type: Date, default: Date.now() }
});

export const PlaceModel = mongoose.model<Place>("Place", PlaceSchema);
