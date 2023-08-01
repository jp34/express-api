import { Tag, TagModel } from "../../domain/entity/tag";
import { CreateTagPayload, TagSearchParams } from "../../domain/dto/tag.dto";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/error";
import logger from "../../config/logger";

/**
 * This method will create a new tag object
 * @param actor Unique id of account that initiated the operation
 * @param payload Values to initialize new tag with
 * @returns The newly created tag object
 */
export const createTag = async (actor: string, payload: CreateTagPayload): Promise<Tag> => {
    const exists = await findTagExists(actor, { name: payload.name });
    if (exists) throw new InvalidOperationError(`Tag already exists with name: ${payload.name}`);
    const parent = await TagModel.findOne({ name: payload.parent }).select('name').lean();
    if (!parent) throw new NonExistentResourceError("Tag", payload.parent);
    const tag = await TagModel.create({
        name: payload.name,
        label: payload.label,
        parent: parent.name,
        ref: payload.ref,
    });
    tag.__v = undefined;
    logger.info({
        operation: "createTag",
        actor,
        payload,
        resource: `tag:${tag.name}`
    });
    return tag;
}

/**
 * Returns all existing tags
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate tag by
 * @param offset Number of documents to skip
 * @param limit Number of documents to return
 * @returns Array of tag objects
 */
export const findTags = async (actor: string, params: TagSearchParams, offset?: number, limit?: number): Promise<Tag[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const tags = await TagModel.find(params).skip(off).limit(lim).select('-__v').lean();
    logger.info({
        operation: "findTags",
        actor,
        params,
        additionalParams: { offset, limit }
    });
    return tags;
}

/**
 * Returns a single tag by its name
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate tag by
 * @returns Tag object if it exists
 */
export const findTag = async (actor: string, params: TagSearchParams): Promise<Tag> => {
    const tag = await TagModel.findOne(params).select('-__v').lean();
    if (!tag) throw new NonExistentResourceError("tag", JSON.stringify(params));
    logger.info({
        operation: "findTag",
        actor,
        params,
        resource: `tag:${tag.name}`
    });
    return tag;
}

/**
 * This method will determine if a tag exists with the matching parameters
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate tag by
 * @returns True if a matching tag exists, otherwise false
 */
export const findTagExists = async (actor: string, params: TagSearchParams): Promise<Boolean> => {
    const tag = await TagModel.findOne(params).select('name').lean();
    if (tag == undefined) return false;
    logger.info({
        operation: "findTagExists",
        actor,
        params,
        resource: `tag:${tag.name}`
    });
    return true;
}

/**
 * This method will locate the ref attribute for each tag provided
 * @param actor Unique id of account that initiated the operation
 * @param tags Array of tag names to translate into refs
 * @returns Array of objects mapping name and ref
 */
export const findTagRefs = async (actor: string, tags: string[]): Promise<{ name: string, ref: string }[]> => {
    const refs = await TagModel.find({ 'name': { $in: tags }}).select('name ref').lean();
    logger.info({
        operation: "findTagRefs",
        actor,
        additionalParams: { tags }
    });
    return refs;
}

/**
 * This method will return the number of tags stored in the database
 * @param actor Unique id of account that initiated the operation
 * @returns Number of existing tags
 */
export const findTagCount = async (actor: string): Promise<Number> => {
    const count = await TagModel.countDocuments();
    logger.info({
        operation: "findTagCount",
        actor,
    });
    return count;
}

/**
 * This method will update the label of the specified tag
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate tag by
 * @param label New label for tag
 * @returns True if update was successful, otherwise false
 */
export const updateTagLabel = async (actor: string, params: TagSearchParams, label: string): Promise<Boolean> => {
    const tag = await TagModel.findOne(params).select('name label dateModified');
    if (!tag) throw new NonExistentResourceError("Tag", JSON.stringify(params));
    tag.label = label;
    tag.dateModified = new Date(Date.now());
    await tag.save();
    logger.info({
        operation: "updateTagLabel",
        actor,
        params,
        additionalParams: { label },
        resource: `tag:${tag.name}`
    });
    return true;
}

/**
 * This method will update the parent attribute of the specified tag
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate tag by
 * @param parent New parent for tag
 * @returns True if update was successful, otherwise false
 */
export const updateTagParent = async (actor: string, params: TagSearchParams, parent: string): Promise<Boolean> => {
    const tag = await TagModel.findOne(params).select('name parent dateModified');
    if (!tag) throw new NonExistentResourceError("Tag", JSON.stringify(params));
    tag.parent = parent;
    tag.dateModified = new Date(Date.now());
    await tag.save();
    logger.info({
        operation: "updateTagParent",
        actor,
        params,
        additionalParams: { parent },
        resource: `tag:${tag.name}`
    });
    return true;
}

/**
 * This method will update the ref attribute of the specified tag
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate tag by
 * @param ref New ref for tag
 * @returns True if update was successful, otherwise false
 */
export const updateTagRef = async (actor: string, params: TagSearchParams, ref: string): Promise<Boolean> => {
    const tag = await TagModel.findOne(params).select('name ref dateModified');
    if (!tag) throw new NonExistentResourceError("Tag", JSON.stringify(params));
    tag.ref = ref;
    tag.dateModified = new Date(Date.now());
    await tag.save();
    logger.info({
        operation: "updateTagRef",
        actor,
        params,
        additionalParams: { ref },
        resource: `tag:${tag.name}`
    });
    return true;
}

/**
 * Delete a single tag by its identifier
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate tag by
 * @returns True if the deletion was successful, otherwise false
 */
export const deleteTag = async (actor: string, params: TagSearchParams): Promise<Boolean> => {
    const tag = await TagModel.findOne(params).select('name');
    if (!tag) throw new NonExistentResourceError("tag", JSON.stringify(params));
    await tag.deleteOne();
    logger.info({
        operation: "deleteTag",
        actor,
        params,
        resource: `tag:${tag.name}`
    });
    return true;
}
