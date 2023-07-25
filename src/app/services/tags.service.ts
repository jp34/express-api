import { Tag, TagDTO, TagModel, CreateTagPayload } from "../../domain/entity/tag";
import { NonExistentResourceError } from "../../domain/error";
import { toTagDTO } from "../../domain/entity/tag";
import logger from "../../config/logger";

/**
 * Creates a new tag objcet
 * @param actor Unique id of account that initiated the operation
 * @param tag Identifier of new tag
 * @param label Label of new tag
 * @param plural Plural label of new tag
 * @param parent Identifier of parent tag
 * @returns The newly created tag object
 */
export const createTag = async (actor: string, data: CreateTagPayload): Promise<TagDTO> => {
    const actualParent = await TagModel.findOne({ name: data.parent });
    if (!actualParent) throw new NonExistentResourceError("Tag", data.parent);
    const tag = await TagModel.create({
        name: data.name,
        label: data.label,
        parent: data.parent,
        ref: data.ref,
    });
    return toTagDTO(tag);
}

/**
 * Returns all existing tags
 * @param actor Unique id of account that initiated the operation
 * @returns Array of tag objects
 */
export const findTags = async (actor: string, offset?: number, limit?: number): Promise<TagDTO[]> => {
    let results = [];
    if (offset && limit) results = await TagModel.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await TagModel.find().skip(offset);
    else if (!offset && limit) results = await TagModel.find().limit(limit);
    else results = await TagModel.find();
    let tags: TagDTO[] = [];
    results.forEach((result) => {
        tags.push(toTagDTO(result));
    });
    return tags;
}

export const findTagRefs = async (actor: string, tags: string[]): Promise<string[]> => {
    const data = await TagModel.find({ 'name': { $in: tags }}).select('ref -_id');
    let refs: string[] = [];
    data.forEach((obj) => {
        refs.push(obj.ref);
    });
    return refs;
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
export const findTag = async (actor: string, name: string): Promise<TagDTO | undefined> => {
    const tag = await TagModel.findOne({ name });
    if (!tag) return undefined;
    return toTagDTO(tag);
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
