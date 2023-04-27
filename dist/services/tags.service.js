"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.updateTag = exports.locateTag = exports.findTagById = exports.findTag = exports.countTags = exports.findTags = exports.createTag = void 0;
const mongoose_1 = require("mongoose");
const db_1 = require("../config/db");
const error_1 = require("../models/error");
/**
 * Creates a new tag objcet
 * @param tag Identifier of new tag
 * @param label Label of new tag
 * @param plural Plural label of new tag
 * @param parent Identifier of parent tag
 * @returns The newly created tag object
 */
const createTag = (tag, label, plural, parent) => __awaiter(void 0, void 0, void 0, function* () {
    const actualParent = yield db_1.Tag.findOne({ tag: parent });
    if (!actualParent)
        throw new error_1.NonExistentResourceError("Tag", parent);
    return yield db_1.Tag.create({
        tag: tag,
        label: label,
        plural: plural,
        level: (actualParent.level + 1),
        parent: parent,
        ref: "",
        display: false
    });
});
exports.createTag = createTag;
/**
 * Returns all existing tags
 * @returns Array of tag objects
 */
const findTags = (offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (offset && limit)
        return yield db_1.Tag.find().skip(offset).limit(limit);
    else if (offset && !limit)
        return yield db_1.Tag.find().skip(offset);
    else if (!offset && limit)
        return yield db_1.Tag.find().limit(limit);
    else
        return yield db_1.Tag.find();
});
exports.findTags = findTags;
const countTags = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Tag.countDocuments();
});
exports.countTags = countTags;
/**
 * Returns a single tag by its identifier
 * @param tag Tag identifier
 * @returns Tag object if it exists
 */
const findTag = (tag) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Tag.findOne({ tag: tag });
});
exports.findTag = findTag;
/**
 * Returns a single tag by its id
 * @param id Id of tag to return
 * @returns Tag object if it exists
 */
const findTagById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Tag.findOne({ _id: id });
});
exports.findTagById = findTagById;
/**
 * Locates a tag by either its id or unique identifier. If id is a valid
 * object id findById is attempted, otherwise it tries to locate the resource
 * by it's unique tag.
 * @param id Tag identifier (ID or unique tag)
 * @returns Tag object if it exists
 */
const locateTag = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let tag;
    if ((0, mongoose_1.isValidObjectId)(id))
        tag = yield db_1.Tag.findById(id);
    else
        tag = yield db_1.Tag.findOne({ tag: id });
    if (!tag)
        throw new error_1.NonExistentResourceError("Tag", id);
    return tag;
});
exports.locateTag = locateTag;
const updateTag = (id, tag, label, plural, parent, ref, display) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = yield db_1.Tag.findById(id);
    if (!obj)
        throw new error_1.NonExistentResourceError("Tag", id);
    if (tag)
        obj.tag = tag;
    if (label)
        obj.label = label;
    if (plural)
        obj.plural = plural;
    if (parent) {
        const actualParent = yield db_1.Tag.findOne({ tag: parent });
        if (!actualParent)
            throw new error_1.NonExistentResourceError("Tag", parent);
        obj.parent = actualParent.tag;
    }
    if (ref)
        obj.ref = ref;
    if (display)
        obj.display = display;
});
exports.updateTag = updateTag;
/**
 * Delete a single tag by its identifier
 * @param tag Tag identifier
 * @returns Result of deletion
 */
const deleteTag = (tag) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Tag.deleteOne({ tag: tag });
});
exports.deleteTag = deleteTag;
