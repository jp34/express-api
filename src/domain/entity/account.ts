import mongoose, { Schema } from "mongoose";

// ---- Account Model ------------

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

// ---- DTO Model ------------

export interface AccountDTO {
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

export const toAccountDTO = (data: Account): AccountDTO => {
    let dto: AccountDTO = {
        uid: data.uid,
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        birthday: data.birthday,
        hasUser: data.hasUser,
        isVerified: data.isVerified,
        isLocked: data.isLocked,
        lastLogin: data.lastLogin,
        dateCreated: data.dateCreated,
        dateModified: data.dateModified
    };
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
    hasUser: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    dateCreated: { type: Date, default: Date.now() },
    dateModified: { type: Date, default: Date.now() },
});

export const AccountModel = mongoose.model<Account>("Account", AccountSchema);
