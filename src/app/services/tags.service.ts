import { Tag, TagModel, CreateTagPayload } from "../../domain/entity/tag";
import { NonExistentResourceError } from "../../domain/entity/error";

// ---- Utility ------------

const sanitizeTag = (data: any): Tag => {
    const tag: Tag = {
        name: data.name,
        label: data.label,
        parent: data.parent,
        ref: data.ref
    };
    return tag;
}

// ---- Tag ------------

/**
 * Creates a new tag objcet
 * @param tag Identifier of new tag
 * @param label Label of new tag
 * @param plural Plural label of new tag
 * @param parent Identifier of parent tag
 * @returns The newly created tag object
 */
export const createTag = async (actor: string, data: CreateTagPayload): Promise<Tag> => {
    const actualParent = await TagModel.findOne({ name: data.parent });
    if (!actualParent) throw new NonExistentResourceError("Tag", data.parent);
    const tag = await TagModel.create({
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
export const findTags = async (actor: string, offset?: number, limit?: number): Promise<Tag[]> => {
    let results = [];
    if (offset && limit) results = await TagModel.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await TagModel.find().skip(offset);
    else if (!offset && limit) results = await TagModel.find().limit(limit);
    else results = await TagModel.find();
    let tags: Tag[] = [];
    results.forEach((result) => {
        tags.push(sanitizeTag(result));
    });
    return tags;
}

/**
 * This method will return the number of tags stored in the database
 * @returns Number of tags available
 */
export const countTags = async (actor: string): Promise<Number> => {
    return await TagModel.countDocuments();
}

/**
 * Returns a single tag by its name
 * @param actor Unique id of account that initiated the operation
 * @param name Name of the tag to find
 * @returns Tag object if it exists
 */
export const findTag = async (actor: string, name: string): Promise<Tag | undefined> => {
    const tag = await TagModel.findOne({ name });
    if (!tag) return undefined;
    return sanitizeTag(tag);
}

/**
 * This method will update the label of the specified tag
 * @param actor Unique id of account that initiated the operation
 * @param name Name of the tag to be updated
 * @param newLabel New label for tag
 * @returns True if update was successful, otherwise false
 */
export const updateTagLabel = async (actor: string, name: string, newLabel: string): Promise<Boolean> => {
    const t = await TagModel.findOne({ name: name });
    if (!t) throw new NonExistentResourceError("Tag", name);
    t.label = newLabel;
    await t.save();
    return true;
}

/**
 * This method will update the parent of the specified tag
 * @param actor Unique id of account that initiated the operation
 * @param name Name of the tag to be updated
 * @param newParent New parent for tag
 * @returns True if update was successful, otherwise false
 */
export const updateTagParent = async (actor: string, name: string, newParent: string): Promise<Boolean> => {
    const t = await TagModel.findOne({ name: name });
    if (!t) throw new NonExistentResourceError("Tag", name);
    t.parent = newParent;
    await t.save();
    return true;
}

/**
 * This method will update the reference id of the specified tag
 * @param actor Unique id of account that initiated the operation
 * @param name Name of the tag to be updated
 * @param newRef New reference id for tag
 * @returns True if update was successful, otherwise false
 */
export const updateTagRef = async (actor: string, name: string, newRef: string): Promise<Boolean> => {
    const t = await TagModel.findOne({ name: name });
    if (!t) throw new NonExistentResourceError("Tag", name);
    t.ref = newRef;
    await t.save();
    return true;
}

/**
 * Delete a single tag by its identifier
 * @param actor Unique id of account that initiated the operation
 * @param name Name of the tag to be deleted
 * @returns True if the deletion was successful, otherwise false
 */
export const deleteTag = async (actor: string, name: string) => {
    const result = await TagModel.deleteOne({ name });
    return (result.acknowledged && (result.deletedCount == 1));
}
