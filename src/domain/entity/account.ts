import mongoose, { Schema } from "mongoose";

export interface Account {
    uid: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
    hasUser: boolean;
    isVerified: boolean;
    isLocked: boolean;
    lastLogin: Date;
    dateCreated: Date;
    dateModified: Date;
}

export const AccountSchema = new Schema<Account>({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    birthday: { type: String, required: true },
    hasUser: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    dateCreated: { type: Date, default: Date.now() },
    dateModified: { type: Date, default: Date.now() },
});

export const AccountModel = mongoose.model<Account>("Account", AccountSchema);
