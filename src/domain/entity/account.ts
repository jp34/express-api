import mongoose, { Schema } from "mongoose";

// ---- Account Model ------------

export interface Account {
    uid: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
    verified: boolean;
    locked: boolean;
    last_login: Date;
    created: Date;
    modified: Date;
}

// ---- Mongoose Model ------------

export const AccountSchema = new Schema<Account>({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    birthday: { type: String, required: true },
    verified: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    last_login: { type: Date, default: null },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
});

export const AccountModel = mongoose.model<Account>("Account", AccountSchema);
