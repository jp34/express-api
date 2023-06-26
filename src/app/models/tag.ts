import { Schema } from "mongoose";

export interface ITag {
    tag: string;
    label: string;
    plural: string;
    level: number;
    parent: string;
    ref: string;
    display: boolean;
}

export const TagSchema = new Schema<ITag>({
    tag: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    plural: { type: String, required: true },
    level: { type: Number, required: true },
    parent: { type: String, required: true },
    ref: { type: String, required: true },
    display: { type: Boolean, required: true, default: true },
});
