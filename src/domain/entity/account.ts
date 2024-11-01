import { v4 } from "uuid";
import mongoose, { Schema } from "mongoose";

export interface Account {
    _id: string
    email: string
    password: string
    name: string
    phone: string
    birthday: string
    hasUser: boolean
    lastLogin: Date
    dateCreated: Date
    dateModified: Date
}

export const AccountSchema = new Schema<Account>({
    _id: { type: String, default: v4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    birthday: { type: String, required: true },
    hasUser: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    dateCreated: { type: Date, default: Date.now() },
    dateModified: { type: Date, default: Date.now() },
});

export const AccountModel = mongoose.model<Account>("Account", AccountSchema);
