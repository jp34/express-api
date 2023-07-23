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
