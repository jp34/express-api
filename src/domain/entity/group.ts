import mongoose, { Schema } from "mongoose";

// ---- Group Model ----------------

export interface Group {
    uid: string;
    host: string;
    members: string[];
    dateCreated: Date;
    dateModified: Date;
}

// ---- Request Model ----------------

export type CreateGroupPayload = {
    host: string;
    members: string[];
}

export interface CreateConnectionRequest extends Express.Request {
    body: {
        data: CreateGroupPayload
    }
}

// ---- Mongoose Model ----------------

export const GroupSchema = new Schema<Group>({
    uid: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    members: { type: [String], required: true, default: [] },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateModified: { type: Date, required: true, default: Date.now() },
});

export const GroupModel = mongoose.model<Group>("Group", GroupSchema);
