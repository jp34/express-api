import mongoose, { Schema } from "mongoose";

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
