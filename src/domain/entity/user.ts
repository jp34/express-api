import mongoose, { Schema } from "mongoose";

// ---- User Model ----------------

export interface User {
    uid: string;
    username: string;
    interests: string[];
    friends: string[];
    groups: string[];
    inbox: string[];
    isActive: boolean;
    isOnline: boolean;
    dateCreated: Date;
    dateModified: Date;
}

export type CreateUserPayload = {
    username: string;
    interests: string[];
};

// ---- DTO Model ----------------

export interface UserDTO {
    uid: string;
    username: string;
    interests: string[];
    friends: string[];
    groups: string[];
    inbox: string[];
    isActive: boolean;
    isOnline: boolean;
    dateCreated: Date;
    dateModified: Date;
}

export const toUserDTO = (data: User): UserDTO => {
    let dto: UserDTO = {
        uid: data.uid,
        username: data.username,
        interests: data.interests,
        friends: data.friends,
        groups: data.groups,
        inbox: data.inbox,
        isActive: data.isActive,
        isOnline: data.isOnline,
        dateCreated: data.dateCreated,
        dateModified: data.dateModified
    };
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
    isActive: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now() },
    dateModified: { type: Date, default: Date.now() }
});

export const UserModel = mongoose.model<User>("User", UserSchema);
