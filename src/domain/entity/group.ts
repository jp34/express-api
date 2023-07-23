import mongoose, { Schema } from "mongoose";

// ---- Group Model ----------------

export interface Group {
    uid: string;
    host: string;
    members: string[];
    created: Date;
    modified: Date;
}

// ---- DTO Model ----------------

export interface GroupDTO {
    uid?: string;
    host?: string;
    members?: string[];
    created?: Date;
    modified?: Date;
}

export const toGroupDTO = (data: Group): GroupDTO => {
    let dto: GroupDTO = {};
    if (data.uid) dto.uid = data.uid;
    if (data.host) dto.host = data.host;
    if (data.members) dto.members = data.members;
    if (data.created) dto.created = data.created;
    if (data.modified) dto.modified = data.modified;
    return dto;
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
    created: { type: Date, required: true, default: Date.now() },
    modified: { type: Date, required: true, default: Date.now() },
});

export const GroupModel = mongoose.model<Group>("Group", GroupSchema);
