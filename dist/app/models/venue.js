"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenueSchema = void 0;
const mongoose_1 = require("mongoose");
exports.VenueSchema = new mongoose_1.Schema({
    refId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true },
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
