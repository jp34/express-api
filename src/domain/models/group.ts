import { Schema } from "mongoose";

export interface IGroup {
    uid: string;
    host: string;
    members: string[];
    created: Date;
    modified: Date;
}

export const GroupSchema = new Schema<IGroup>({
    uid: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    members: { type: [String], required: true, default: [] },
    created: { type: Date, required: true, default: Date.now() },
    modified: { type: Date, required: true, default: Date.now() },
});

// Connection Payload Types

export type CreateGroupPayload = {
    host: string;
    members: string[];
}

// Connection Request Interfaces

export interface CreateConnectionRequest extends Express.Request {
    body: {
        data: CreateGroupPayload
    }
}
