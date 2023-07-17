import { Schema } from "mongoose";

// Account Model

export interface IAccount {
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

export const AccountSchema = new Schema<IAccount>({
    // Authentication Info
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    birthday: { type: String, required: true },

    // Status Info
    verified: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    last_login: { type: Date, default: null },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
});

// Account Payload Types

export type UpdateAccountPayload = {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    birthday?: string;
}

// Account Response Types

export type AccountResponse = {
    uid: string;
    email: string;
    name: string;
    phone: string;
    birthday: string;
    verified: boolean;
    locked: boolean;
    last_login: Date;
    created?: Date;
    modified?: Date;
}

// Account Request Interfaces

export interface UpdateAccountRequest extends Express.Request {
    params: {
        uid: string
    },
    body: {
        data: UpdateAccountPayload
    }
}
