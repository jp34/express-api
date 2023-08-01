import { Tag, TagModel } from "../../domain/entity/tag";
import { CreateTagPayload } from "../../domain/dto/tag.dto";
import { NonExistentResourceError } from "../../domain/error";

// ---- Create Methods --------

/**
 * Creates a new tag objcet
 * @param actor Unique id of account that initiated the operation
 * @param tag Identifier of new tag
 * @param label Label of new tag
 * @param plural Plural label of new tag
 * @param parent Identifier of parent tag
 * @returns The newly created tag object
 */
export const createTag = async (actor: string, data: CreateTagPayload): Promise<Tag> => {
    const parent = await TagModel.findOne({ name: data.parent }).select('name').lean();
    if (!parent) throw new NonExistentResourceError("Tag", data.parent);
    const tag = await TagModel.create({
        name: data.name,
        label: data.label,
        parent: parent.name,
        ref: data.ref,
    });
    tag.__v = undefined;
    return tag;
}

// ---- Read Methods --------

/**
 * Returns all existing tags
 * @param actor Unique id of account that initiated the operation
 * @returns Array of tag objects
 */
export const findTags = async (actor: string, offset?: number, limit?: number): Promise<Tag[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const tags = await TagModel.find().skip(off).limit(lim).select('-_id -__v').lean();
    return tags;
}

export const findTagRefs = async (actor: string, tags: string[]): Promise<string[]> => {
    const data = await TagModel.find({ 'name': { $in: tags }}).select('ref -_id').lean();
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
export const findTag = async (actor: string, name: string): Promise<Tag> => {
    const tag = await TagModel.findOne({ name }).select('-_id -__v').lean();
    if (!tag) throw new NonExistentResourceError("tag", name);
    return tag;
}

// ---- Update Methods --------

/**
 * This method will update the label of the specified tag
 * @param actor Unique id of account that initiated the operation
 * @param name Name of the tag to be updated
 * @param newLabel New label for tag
 * @returns True if update was successful, otherwise false
 */
export const updateTagLabel = async (actor: string, name: string, newLabel: string): Promise<Boolean> => {
    const t = await TagModel.findOne({ name: name }).select('label');
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
    const t = await TagModel.findOne({ name: name }).select('parent');
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
    const t = await TagModel.findOne({ name: name }).select('ref');
    if (!t) throw new NonExistentResourceError("Tag", name);
    t.ref = newRef;
    await t.save();
    return true;
}

// ---- Delete Methods --------

/**
 * Delete a single tag by its identifier
 * @param actor Unique id of account that initiated the operation
 * @param name Name of the tag to be deleted
 * @returns True if the deletion was successful, otherwise false
 */
export const deleteTag = async (actor: string, name: string): Promise<Boolean> => {
    const result = await TagModel.deleteOne({ name });
    return (result.acknowledged && (result.deletedCount == 1));
}
