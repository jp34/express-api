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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const accounts_service_1 = require("../services/accounts.service");
const token_service_1 = require("../services/token.service");
const error_1 = require("../models/error");
const logger_1 = __importDefault(require("../../config/logger"));
class AuthController {
    constructor() {
        /**
         * POST /auth/login
         * This route allows a user to authenticate themselves with email and password
         * @param request Http request
         * @param response Http response
         * @param next Next middleware function
         */
        this.login = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = request.body.data;
                if (!data.email)
                    throw new error_1.InvalidInputError('email');
                if (!data.password)
                    throw new error_1.InvalidInputError('password');
                // Fetch account and verify it exists
                const account = yield (0, accounts_service_1.findAccountByEmail)(data.email);
                if (account == undefined)
                    throw new Error("Invalid credentials provided");
                // Compare password
                const result = yield bcrypt_1.default.compare(data.password, account.password);
                if (!result)
                    throw Error("Invalid credentials provided");
                // Create jwt and return to user
                const tokens = (0, token_service_1.generateTokenPair)(account.id);
                response.status(200).json({ account: account, tokens: tokens });
                return next();
            }
            catch (err) {
                if (err instanceof Error)
                    logger_1.default.warn(`Login attempt failed: ${err.message}`);
                logger_1.default.error(err);
                response.status(400).json({ error: err });
                return next(err);
            }
        });
        /**
         * POST /auth/signup
         * This route allows a user to create a new account
         * @param request Http request
         * @param response Http response
         * @param next Next middleware function
         */
        this.signup = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = request.body.data;
                if (!data)
                    throw new error_1.InvalidInputError('body');
                // Validate user does not already exist
                const exists = yield (0, accounts_service_1.findAccountExistsWithEmail)(data.email);
                if (exists)
                    throw new Error(`Account already exists with email(${data.email})`);
                // Create user, tokens
                const account = yield (0, accounts_service_1.createAccount)(data.email, data.password, data.username, data.phone, data.birthday);
                const tokens = (0, token_service_1.generateTokenPair)(account.id);
                response.status(200).json({ account: account, tokens: tokens });
                return next();
            }
            catch (err) {
                if (err instanceof Error)
                    logger_1.default.warn(`Register attempt failed: ${err.message}`);
                logger_1.default.error(err);
                response.status(400).json({ error: err });
                return next();
            }
        });
        /**
         * POST /auth/refresh
         * This route allows a user to refresh their access token using a refresh token
         * @param request Http request
         * @param response Http response
         * @param next Next middleware function
         */
        this.refresh = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract refresh token and validate
                const data = request.body.data;
                if (!data.refresh)
                    throw new error_1.InvalidInputError('refresh');
                // Generate new access token
                const token = (0, token_service_1.refreshAccessToken)(data.refresh);
                response.status(200).json({ tokens: { access: token } });
                return next();
            }
            catch (err) {
                if (err instanceof Error)
                    logger_1.default.warn(`Register attempt failed: ${err.message}`);
                logger_1.default.error(err);
                response.status(406).json({ error: err });
                return next(err);
            }
        });
    }
}
exports.default = AuthController;
