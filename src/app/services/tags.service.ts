import { Tag } from "../../config/db";
import { NonExistentResourceError } from "../models/error";
import { CreateTagPayload, TagResponse, UpdateTagPayload } from "../models/tag";

const sanitizeTag = (data: any): TagResponse => {
    const tag: TagResponse = {
        name: data.name,
        label: data.label,
        parent: data.parent,
        ref: data.ref
    };
    return tag;
}

/**
 * Creates a new tag objcet
 * @param tag Identifier of new tag
 * @param label Label of new tag
 * @param plural Plural label of new tag
 * @param parent Identifier of parent tag
 * @returns The newly created tag object
 */
export const createTag = async (data: CreateTagPayload) => {
    const actualParent = await Tag.findOne({ name: data.parent });
    if (!actualParent) throw new NonExistentResourceError("Tag", data.parent);
    const tag = await Tag.create({
        name: data.name,
        label: data.label,
        parent: data.parent,
        ref: data.ref,
    });
    return sanitizeTag(tag);
}

/**
 * Returns all existing tags
 * @returns Array of tag objects
 */
export const findTags = async (offset?: number, limit?: number) => {
    let results = [];
    if (offset && limit) results = await Tag.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await Tag.find().skip(offset);
    else if (!offset && limit) results = await Tag.find().limit(limit);
    else results = await Tag.find();

    let tags: [TagResponse?] = [];
    results.forEach((result) => {
        tags.push(sanitizeTag(result));
    });
    return tags;
}

export const countTags = async () => {
    return await Tag.countDocuments();
}

/**
 * Returns a single tag by its identifier
 * @param tag Tag identifier
 * @returns Tag object if it exists
 */
export const findTag = async (name: string) => {
    const tag = await Tag.findOne({ name });
    return sanitizeTag(tag);
}

export const updateTag = async (name: string, data: UpdateTagPayload) => {
    const tag = await Tag.findOne({ name });
    if (!tag) throw new NonExistentResourceError("Tag", name);
    if (data.label) tag.label = data.label;
    if (data.parent) {
        const actualParent = await Tag.findOne({ name: data.parent });
        if (!actualParent) throw new NonExistentResourceError("Tag", data.parent);
        tag.parent = actualParent.name;
    }
    if (data.ref) tag.ref = data.ref;
    const saved = await tag.save();
    return sanitizeTag(saved);
}

/**
 * Delete a single tag by its identifier
 * @param id Tag identifier
 * @returns Result of deletion
 */
export const deleteTag = async (name: string) => {
    const result = await Tag.deleteOne({ name });
    return (result.acknowledged && (result.deletedCount == 1));
}
