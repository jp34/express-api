import mongoose, { Schema } from "mongoose";

// ---- Tag Model ------------

export interface Tag {
    name: string;
    label: string;
    parent: string;
    ref: string;
}

// ---- DTO Model ------------

export interface TagDTO {
    name?: string;
    label?: string;
    parent?: string;
    ref?: string;
}

export const toTagDTO = (data: Tag): TagDTO => {
    let dto: TagDTO = {};
    if (data.name) dto.name = data.name;
    if (data.label) dto.label = data.label;
    if (data.parent) dto.parent = data.parent;
    if (data.ref) dto.ref = data.ref;
    return dto;
}

// ---- Request Model ------------

export type CreateTagPayload = {
    name: string;
    label: string;
    parent: string;
    ref: string;
}

export interface CreateTagRequest extends Express.Request {
    body: {
        data: CreateTagPayload
    }
}

// ---- Mongoose Model ------------

export const TagSchema = new Schema<Tag>({
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    parent: { type: String, required: true },
    ref: { type: String, required: true },
});

export const TagModel = mongoose.model<Tag>("Tag", TagSchema);
