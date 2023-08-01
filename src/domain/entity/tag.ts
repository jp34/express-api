import { v4 } from "uuid";
import mongoose, { Schema } from "mongoose";

export interface Tag {
    _id: string
    name: string
    label: string
    parent: string
    ref: string
    dateCreated: Date
    dateModified: Date
}

export const TagSchema = new Schema<Tag>({
    _id: { type: String, default: v4 },
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    parent: { type: String, required: true },
    ref: { type: String, required: true },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateModified: { type: Date, required: true, default: Date.now() },
});

export const TagModel = mongoose.model<Tag>("Tag", TagSchema);
