"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.Venue = exports.Tag = exports.Account = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sn_core_1 = require("sn-core");
const error_1 = require("./error");
exports.Account = mongoose_1.default.model("Account", sn_core_1.AccountSchema);
exports.Tag = mongoose_1.default.model("Tag", sn_core_1.TagSchema);
exports.Venue = mongoose_1.default.model("Venue", sn_core_1.VenueSchema);
const connect = () => {
    const url = process.env.API_MONGO_STRING;
    if (!url)
        throw new error_1.ConfigurationError("Environment variable missing: API_MONGO_STRING");
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(url);
};
exports.connect = connect;
