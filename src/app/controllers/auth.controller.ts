import { Response, NextFunction } from "express";
import { findAccountExistsWithEmail, createAccount, validateCredentials } from "../services/accounts.service";
import { generateTokenPair, refreshAccessToken } from "../services/token.service";
import { CreateAccountPayload } from "../models/account";
import { LoginRequest, RefreshRequest, SignupRequest } from "../models/auth";
import { InvalidInputError, ServerError } from "../models/error";
import logger from "../../config/logger";

export default class AuthController {

    /**
     * POST /auth/login
     * This route allows a user to authenticate themselves with email and password
     * @param request Http request
     * @param response Http response
     * @param next Next middleware function
     */
    public login = async (request: LoginRequest, response: Response, next: NextFunction) => {
        try {
            const data = request.body.data;
            if (!data.email) throw new InvalidInputError('email');
            if (!data.password) throw new InvalidInputError('password');
            const account = await validateCredentials(data.email, data.password);
            const tokens = generateTokenPair(account.uid);
            response.status(200).json({ data: {
                account: account,
                tokens: tokens
            }});
            next();
        } catch (err: any) {
            if (err instanceof Error) logger.warn(`Authentication attempt failed: ${err.message}`);
            logger.error(err);
            response.status(400).json({ error: err.message });
            return next(err);
        }
    }

    /**
     * POST /auth/signup
     * This route allows a user to create a new account
     * @param request Http request
     * @param response Http response
     * @param next Next middleware function
     */
    public signup = async (request: SignupRequest, response: Response, next: NextFunction) => {
        try {
            const data: CreateAccountPayload = request.body.data;
            if (!data) throw new InvalidInputError('body');
            // Validate user does not already exist
            const exists = await findAccountExistsWithEmail(data.email);
            if (exists) throw new Error(`Account already exists with email(${data.email})`);
            // Create user, tokens
            const account = await createAccount(data);
            if (!account) throw new ServerError("Failed to create new account");
            const tokens = generateTokenPair(account.uid);
            response.status(200).json({ data: { account: account, tokens: tokens }});
            next();
        } catch (err: any) {
            if (err instanceof Error) logger.warn(`Register attempt failed: ${err.message}`);
            logger.error(err);
            response.status(400).json({ error: err });
            return next();
        }
    }

    /**
     * POST /auth/refresh
     * This route allows a user to refresh their access token using a refresh token
     * @param request Http request
     * @param response Http response
     * @param next Next middleware function
     */
    public refresh = async (request: RefreshRequest, response: Response, next: NextFunction) => {
        try {
            // Extract refresh token and validate
            const data = request.body.data;
            if (!data.refresh) throw new InvalidInputError('refresh');
            // Generate new access token
            const token = refreshAccessToken(data.refresh);
            response.status(200).json({ data: { tokens: { access: token }}});
            next();
        } catch (err: any) {
            if (err instanceof Error) logger.warn(`Register attempt failed: ${err.message}`);
            logger.error(err);
            response.status(406).json({ error: err });
            return next(err);
        }
    }
}
