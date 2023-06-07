import { Schema } from "mongoose";

export interface IAccount {
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
    verified: boolean;
    locked: boolean;
    deactivated: boolean;
    created: Date;
    modified: Date;
}

export const AccountSchema = new Schema<IAccount>({
    // Authentication Info
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // PII Info
    name: { type: String },
    phone: { type: String },
    birthday: { type: String },

    // Status Info
    verified: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
});
