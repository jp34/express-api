import { Tag } from "../../config/db";
import { NonExistentResourceError } from "../models/error";
import { CreateTagPayload, UpdateTagPayload } from "../models/io";

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
    return await Tag.create({
        name: data.name,
        label: data.label,
        parent: data.parent,
        ref: data.ref,
    });
}

/**
 * Returns all existing tags
 * @returns Array of tag objects
 */
export const findTags = async (offset?: number, limit?: number) => {
    if (offset && limit) return await Tag.find().skip(offset).limit(limit);
    else if (offset && !limit) return await Tag.find().skip(offset);
    else if (!offset && limit) return await Tag.find().limit(limit);
    else return await Tag.find();
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
    return await Tag.findOne({ name: name });
}

/**
 * Returns a single tag by its id
 * @param id Id of tag to return
 * @returns Tag object if it exists
 */
export const findTagById = async (id: string) => {
    return await Tag.findOne({ _id: id });
}

export const updateTag = async (name: string, data: UpdateTagPayload) => {
    const tag = await findTag(name);
    if (!tag) throw new NonExistentResourceError("Tag", name);
    if (data.label) tag.label = data.label;
    if (data.parent) {
        const actualParent = await Tag.findOne({ name: data.parent });
        if (!actualParent) throw new NonExistentResourceError("Tag", data.parent);
        tag.parent = actualParent.name;
    }
    if (data.ref) tag.ref = data.ref;
    return await tag.save();
}

/**
 * Delete a single tag by its identifier
 * @param id Tag identifier
 * @returns Result of deletion
 */
export const deleteTag = async (name: string) => {
    const result = await Tag.deleteOne({ name: name });
    return (result.acknowledged && (result.deletedCount == 1));
}
