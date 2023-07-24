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

// ---- DTO Model ------------

export interface AccountDTO {
    uid: string;
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    birthday?: string;
    verified?: boolean;
    locked?: boolean;
    last_login?: Date;
    created?: Date;
    modified?: Date;
}

export const toAccountDTO = (data: Account): AccountDTO => {
    let dto: AccountDTO = {
        uid: data.uid
    };
    if (data.email) dto.email = data.email;
    if (data.password) dto.password = data.password;
    if (data.name) dto.name = data.name;
    if (data.phone) dto.phone = data.phone;
    if (data.birthday) dto.birthday = data.birthday;
    if (data.verified != undefined) dto.verified = data.verified;
    if (data.locked != undefined) dto.locked = data.locked;
    if (data.last_login) dto.last_login = data.last_login;
    if (data.created) dto.created = data.created;
    if (data.modified) dto.modified = data.modified;
    return dto;
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
