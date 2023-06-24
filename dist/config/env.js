"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logger_1 = __importDefault(require("../config/logger"));
const error_1 = require("../models/error");
const PORT = process.env.API_PORT;
if (!PORT)
    throw new error_1.ConfigurationError("Missing or invalid environment variable: API_PORT");
logger_1.default.debug(`PORT: ${PORT}`);
const ACCESS_SECRET = process.env.API_ACCESS_SECRET;
if (!ACCESS_SECRET)
    throw new error_1.ConfigurationError("Missing or invalid environment variable: API_ACCESS_SECRET");
logger_1.default.debug(`ACCESS_SECRET: ${ACCESS_SECRET}`);
const ACCESS_EXP = process.env.API_ACCESS_EXP;
if (!ACCESS_EXP)
    throw new error_1.ConfigurationError("Missing or invalid environment variable: API_ACCESS_EXP");
logger_1.default.debug(`ACCESS_EXP: ${ACCESS_EXP}`);
const REFRESH_SECRET = process.env.API_REFRESH_SECRET;
if (!REFRESH_SECRET)
    throw new error_1.ConfigurationError("Missing or invalid environment variable: API_REFRESH_SECRET");
logger_1.default.debug(`REFRESH_SECRET: ${REFRESH_SECRET}`);
const REFRESH_EXP = process.env.API_REFRESH_EXP;
if (!REFRESH_EXP)
    throw new error_1.ConfigurationError("Missing or invalid environment variable: API_REFRESH_EXP");
logger_1.default.debug(`REFRESH_EXP: ${REFRESH_EXP}`);
const MONGO_STRING = process.env.API_MONGO_STRING;
if (!MONGO_STRING)
    throw new error_1.ConfigurationError("Missing or invalid environment variable: API_MONGO_STRING");
logger_1.default.debug(`MONGO_STRING: ${MONGO_STRING}`);
const Env = {
    PORT,
    ACCESS_SECRET,
    ACCESS_EXP,
    REFRESH_SECRET,
    REFRESH_EXP,
    MONGO_STRING
};
exports.default = Env;
