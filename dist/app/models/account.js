"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AccountSchema = new mongoose_1.Schema({
    // Authentication Info
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: String },
    birthday: { type: String, required: true },
    // Status Info
    verified: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
});
