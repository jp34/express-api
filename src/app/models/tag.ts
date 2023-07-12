import { Schema } from "mongoose";

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
