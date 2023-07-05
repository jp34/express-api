import { Schema } from "mongoose";

export interface IAccount {
    email: string;
    password: string;
    name: string;
    username: string;
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
    name: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: String },
    birthday: { type: String, required: true },

    // Status Info
    verified: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
});
