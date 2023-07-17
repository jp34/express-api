import { Schema } from "mongoose";

// Tag Model

export interface ITag {
    name: string;
    label: string;
    parent: string;
    ref: string;
}

export const TagSchema = new Schema<ITag>({
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    parent: { type: String, required: true },
    ref: { type: String, required: true },
});

// Tag Payload Types

export type CreateTagPayload = {
    name: string;
    label: string;
    parent: string;
    ref: string;
}

export type UpdateTagPayload = {
    label?: string;
    parent?: string;
    ref?: string;
}

// Tag Response Types

export type TagResponse = {
    name: string;
    label: string;
    parent: string;
    ref: string;
}

// Tag Request Interfaces

export interface CreateTagRequest extends Express.Request {
    body: {
        data: CreateTagPayload
    }
}

export interface UpdateTagRequest extends Express.Request {
    params: {
        name: string
    },
    body: {
        data: UpdateTagPayload
    }
}
