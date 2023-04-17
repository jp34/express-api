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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../config/error");
const SECRET = (_a = process.env.API_ACCESS_SECRET) !== null && _a !== void 0 ? _a : undefined;
/**
 * This middleware function authorizes the request via a access token.
 * @param request Http request
 * @param response Http response
 * @param next Next middleware function
 * @returns Result of next middleware function, or bad request response
 */
const authorize = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (SECRET == undefined)
        throw new error_1.ConfigurationError("Missing environment variable: API_ACCESS_SECRET");
    if (!request.headers.authorization)
        throw new error_1.InvalidInputError("Missing authorization token: Bearer");
    const token = parseBearerToken(request.headers.authorization);
    jsonwebtoken_1.default.verify(token, SECRET, (err, decoded) => {
        if (err || !decoded || typeof decoded == "string") {
            response.status(406).json({ status: "error", error: "Invalid or malformed access token provided" });
        }
        else {
            request.user = { id: decoded.id };
        }
    });
    next();
});
exports.authorize = authorize;
/**
 * This helper function extracts the bearer token from an authorization string
 * @param authString Authorization string containing a bearer token
 * @returns The parsed bearer token
 */
const parseBearerToken = (authString) => {
    const token = authString.split(' ')[1];
    if (token == undefined)
        throw new error_1.InvalidInputError("Access Token");
    return token;
};
