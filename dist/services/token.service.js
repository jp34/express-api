"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.generateRefreshToken = exports.generateAccessToken = exports.generateTokenPair = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../models/error");
const API_ACCESS_SECRET = (_a = process.env.API_ACCESS_SECRET) !== null && _a !== void 0 ? _a : undefined;
const API_REFRESH_SECRET = (_b = process.env.API_REFRESH_SECRET) !== null && _b !== void 0 ? _b : undefined;
const API_ACCESS_EXP = (_c = process.env.API_ACCESS_EXP) !== null && _c !== void 0 ? _c : undefined;
const API_REFRESH_EXP = (_d = process.env.API_REFRESH_EXP) !== null && _d !== void 0 ? _d : undefined;
const generateTokenPair = (accountId) => {
    return {
        access: (0, exports.generateAccessToken)(accountId),
        refresh: (0, exports.generateRefreshToken)(accountId)
    };
};
exports.generateTokenPair = generateTokenPair;
const generateAccessToken = (accountId) => {
    if (API_ACCESS_SECRET == undefined)
        throw new error_1.ConfigurationError("Missing environment variable: API_ACCESS_SECRET");
    if (API_ACCESS_EXP == undefined)
        throw new error_1.ConfigurationError("Missing environment variable: API_ACCESS_EXP");
    return jsonwebtoken_1.default.sign({ id: accountId, tokenType: 'access' }, API_ACCESS_SECRET, { expiresIn: API_ACCESS_EXP });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (accountId) => {
    if (API_REFRESH_SECRET == undefined)
        throw new error_1.ConfigurationError("Missing environment variable: API_REFRESH_SECRET");
    if (API_REFRESH_EXP == undefined)
        throw new error_1.ConfigurationError("Missing environment variable: API_REFRESH_EXP");
    return jsonwebtoken_1.default.sign({ id: accountId, tokenType: 'access' }, API_REFRESH_SECRET, { expiresIn: API_REFRESH_EXP });
};
exports.generateRefreshToken = generateRefreshToken;
const refreshAccessToken = (refreshToken) => {
    if (API_REFRESH_SECRET == undefined)
        throw new error_1.ConfigurationError("Missing environment variable: API_REFRESH_SECRET");
    const decoded = jsonwebtoken_1.default.verify(refreshToken, API_REFRESH_SECRET);
    if (!decoded || typeof decoded == "string")
        throw new error_1.UnauthorizedError("Invalid or malformed token provided");
    return (0, exports.generateAccessToken)(decoded.id);
};
exports.refreshAccessToken = refreshAccessToken;
