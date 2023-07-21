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
    friends: { type: [], default: [] },
    groups: { type: [], default: [] },
    inbox: { type: [], default: [] },
    active: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() }
});

// User Payload Types

export type CreateUserPayload = {
    uid: string;
    username: string;
    interests: string[];
};

export type UpdateUserPayload = {
    username?: string;
    active?: boolean;
    online?: boolean;
};

// User Request Interfaces

export interface UpdateUserRequest extends Express.Request {
    params: {
        uid: string
    }
    body: {
        data: UpdateUserPayload
    }
}
