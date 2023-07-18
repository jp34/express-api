import { Response, NextFunction } from "express";
import { generateTokenPair, refreshAccessToken } from "../services/token.service";
import {
    AuthenticationPayload,
    AuthenticationRequest,
    RefreshRequest,
    RegistrationPayload,
    RegistrationRequest
} from "../models/auth";
import { InvalidInputError } from "../models/error";
import logger from "../../config/logger";
import { register, authenticate } from "../services/auth.service";

export default class AuthController {

    /**
     * POST /auth/login
     * This route allows a user to authenticate themselves with email and password
     * @param request Http request
     * @param response Http response
     * @param next Next middleware function
     */
    public login = async (request: AuthenticationRequest, response: Response, next: NextFunction) => {
        try {
            const data: AuthenticationPayload = request.body.data;
            if (!data.identifier) throw new InvalidInputError('identifier');
            if (!data.password) throw new InvalidInputError('password');
            const account = await authenticate(data);
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
    public signup = async (request: RegistrationRequest, response: Response, next: NextFunction) => {
        try {
            const data: RegistrationPayload = request.body.data;
            if (!data) throw new InvalidInputError('data');
            const account = await register(data);
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
            response.status(200).json({ data: { tokens: { access: token, refresh: data.refresh }}});
            next();
        } catch (err: any) {
            if (err instanceof Error) logger.warn(`Register attempt failed: ${err.message}`);
            logger.error(err);
            response.status(406).json({ error: err });
            return next(err);
        }
    }
}
