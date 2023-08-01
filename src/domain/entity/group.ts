import { v4 } from "uuid";
import mongoose, { Schema } from "mongoose";

export interface Group {
    _id: string
    host: string
    members: string[]
    dateCreated: Date
    dateModified: Date
}

export interface CreateGroupPayload {
    host: string
    members: string[]
}

export interface CreateConnectionRequest extends Express.Request {
    body: {
        data: CreateGroupPayload
    }
}

export const GroupSchema = new Schema<Group>({
    _id: { type: String, default: v4 },
    host: { type: String, required: true },
    members: { type: [String], required: true, default: [] },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateModified: { type: Date, required: true, default: Date.now() },
});

export const GroupModel = mongoose.model<Group>("Group", GroupSchema);
