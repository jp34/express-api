import { Schema } from "mongoose";

export interface IVenueAddress {
    streetName: string;
    streetNumber: string;
    unit: string;
    country: string;
    city: string;
    state: string;
    zip: string;
}

export interface IVenueGeo {
    latitude: number;
    longitude: number;
}

export interface IVenueHours {
    mondayOpen: string;
    mondayClose: string;
    tuesdayOpen: string;
    tuesdayClose: string;
    wednesdayOpen: string;
    wednesdayClose: string;
    thursdayOpen: string;
    thursdayClose: string;
    fridayOpen: string;
    fridayClose: string;
    saturdayOpen: string;
    saturdayClose: string;
    sundayOpen: string;
    sundayClose: string;
}

export interface IVenue {
    refId: string;
    title: string;
    phone: string;
    email: string;
    address: IVenueAddress;
    geo: IVenueGeo;
    hours: IVenueHours;
    isOpen: boolean;
    isOperational: boolean;
    created: Date;
    modified: Date;
}

export interface IVenuePayload {
    refId: string;
    title: string;
    phone: string;
    email: string;
    address: IVenueAddress;
    geo: IVenueGeo;
    hours: IVenueHours;
}

export const VenueSchema = new Schema<IVenue>({
    refId: { type: String, required: true, unique: true},
    title: { type: String, required: true},
    phone: { type: String, required: true, unique: true},
    email: { type: String, required: true},
    address: {
        type: {
            streetName: String,
            streetNumber: String,
            unit: String,
            country: String,
            city: String,
            state: String,
            zip: String
        },
        required: true,
        unique: true
    },
    geo: {
        type: {
            latitude: { type: Number, default: 0.0 },
            longitude: { type: Number, default: 0.0 },
        },
        unique: true
    },
    hours: {
        type: {
            mondayOpen: String,
            mondayClose: String,
            tuesdayOpen: String,
            tuesdayClose: String,
            wednesdayOpen: String,
            wednesdayClose: String,
            thursdayOpen: String,
            thursdayClose: String,
            fridayOpen: String,
            fridayClose: String,
            saturdayOpen: String,
            saturdayClose: String,
            sundayOpen: String,
            sundayClose: String
        },
        required: true,
        unique: true
    },

    // Defaulted values
    isOpen: { type: Boolean, required: true, default: false },
    isOperational: { type: Boolean, required: true, default: true },
    created: { type: Date, required: true, default: Date.now() },
    modified: { type: Date, required: true, default: Date.now() },
});
