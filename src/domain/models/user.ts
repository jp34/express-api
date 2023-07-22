import { Schema } from "mongoose";

// User Model

export interface IUser {
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

export const UserSchema = new Schema<IUser>({
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

// User Payload Types

export type CreateUserPayload = {
    username: string;
    interests: string[];
};
