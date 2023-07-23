import mongoose, { Schema } from "mongoose";

// ---- User Model ----------------

export interface User {
    uid: string;
    username: string;
    interests: string[];
    friends: string[];
    groups: string[];
    inbox: string[];
    active: boolean;
    online: boolean;
    created: Date;
    modified: Date;
}

export type CreateUserPayload = {
    username: string;
    interests: string[];
};

// ---- DTO Model ----------------

export interface UserDTO {
    uid?: string;
    username?: string;
    interests?: string[];
    friends?: string[];
    groups?: string[];
    inbox?: string[];
    active?: boolean;
    online?: boolean;
    created?: Date;
    modified?: Date;
}

export const toUserDTO = (data: User): UserDTO => {
    let dto: UserDTO = {};
    if (data.uid) dto.uid = data.uid;
    if (data.username) dto.username = data.username;
    if (data.interests) dto.interests = data.interests;
    if (data.friends) dto.friends = data.friends;
    if (data.groups) dto.groups = data.groups;
    if (data.inbox) dto.inbox = data.inbox;
    if (data.active) dto.active = data.active;
    if (data.online) dto.online = data.online;
    if (data.created) dto.created = data.created;
    if (data.modified) dto.modified = data.modified;
    return dto;
}

// ---- Mongoose Model ------------

export const UserSchema = new Schema<User>({
    uid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    interests: { type: [String], required: true },
    friends: { type: [String], default: [] },                       // User uid's
    groups: { type: [String], default: [] },                        // Group uid's
    inbox: { type: [String], default: [] },                         // Notification uid's
    active: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() }
});

export const UserModel = mongoose.model<User>("User", UserSchema);
