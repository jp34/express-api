import { Schema } from "mongoose";

// User Model

export interface IUser {
    uid: string;
    username: string;
    interests: [string?];
    active: boolean;
    online: boolean
    created: Date;
    modified: Date;
}

export const UserSchema = new Schema<IUser>({
    uid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    interests: { type: [String], default: [] },
    active: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() }
});

// User Payload Types

export type CreateUserPayload = {
    uid: string;
    username: string;
    interests: [string];
};

export type UpdateUserPayload = {
    username: string;
};

// User Response Types

export type UserResponse = {
    uid?: string;
    username?: string;
    interests?: [string?];
    active?: boolean;
    online?: boolean;
    created?: Date;
    modified?: Date;
};

// User Request Interfaces

export interface CreateUserRequest extends Express.Request {
    body: {
        data: CreateUserPayload
    }
}

export interface UpdateUserRequest extends Express.Request {
    params: {
        uid: string;
    },
    body: {
        data: UpdateUserPayload
    }
}
