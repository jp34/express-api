"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TagSchema = new mongoose_1.Schema({
    tag: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    plural: { type: String, required: true },
    level: { type: Number, required: true },
    parent: { type: String, required: true },
    ref: { type: String, required: true },
    display: { type: Boolean, required: true, default: true },
});
