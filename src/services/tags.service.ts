import { isValidObjectId } from "mongoose";
import { Tag } from "../config/db";
import { NonExistentResourceError } from "../config/error";

/**
 * Creates a new tag objcet
 * @param tag Identifier of new tag
 * @param label Label of new tag
 * @param plural Plural label of new tag
 * @param parent Identifier of parent tag
 * @returns The newly created tag object
 */
export const createTag = async (tag: string, label: string, plural: string, parent: string) => {
    const actualParent = await Tag.findOne({ tag: parent });
    if (!actualParent) throw new NonExistentResourceError("Tag", parent);
    return await Tag.create({
        tag: tag,
        label: label,
        plural: plural,
        level: (actualParent.level + 1),
        parent: parent,
        ref: "",
        display: false
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
export const findTag = async (tag: string) => {
    return await Tag.findOne({ tag: tag });
}

/**
 * Returns a single tag by its id
 * @param id Id of tag to return
 * @returns Tag object if it exists
 */
export const findTagById = async (id: string) => {
    return await Tag.findOne({ _id: id });
}

/**
 * Locates a tag by either its id or unique identifier. If id is a valid
 * object id findById is attempted, otherwise it tries to locate the resource
 * by it's unique tag.
 * @param id Tag identifier (ID or unique tag)
 * @returns Tag object if it exists
 */
export const locateTag = async (id: string) => {
    let tag;
    if (isValidObjectId(id)) tag = await Tag.findById(id);
    else tag = await Tag.findOne({ tag: id });
    if (!tag) throw new NonExistentResourceError("Tag", id);
    return tag;
}

export const updateTag = async (id: string, tag?: string, label?: string, plural?: string, parent?: string, ref?: string, display?: boolean) => {
    const obj = await Tag.findById(id);
    if (!obj) throw new NonExistentResourceError("Tag", id);
    if (tag) obj.tag = tag;
    if (label) obj.label = label;
    if (plural) obj.plural = plural;
    if (parent) {
        const actualParent = await Tag.findOne({ tag: parent });
        if (!actualParent) throw new NonExistentResourceError("Tag", parent);
        obj.parent = actualParent.tag;
    }
    if (ref) obj.ref = ref;
    if (display) obj.display = display;
}

/**
 * Delete a single tag by its identifier
 * @param tag Tag identifier
 * @returns Result of deletion
 */
export const deleteTag = async (tag: string) => {
    return await Tag.deleteOne({ tag: tag });
}
