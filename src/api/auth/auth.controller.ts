import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { findAccountByEmail, findAccountExistsWithEmail, createAccount } from "../../services/accounts.service";
import { generateTokenPair, refreshAccessToken } from "../../services/token.service";
import { LoginRequest, RefreshRequest, SignupRequest } from "../../config/io";
import { CreateAccountPayload } from "sn-core";
import { InvalidInputError } from "../../config/error";
import logger from "../../config/logger";

export default class AuthController {

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
            const account = await createAccount(data.email, data.password, data.birthday);
            const tokens = generateTokenPair(account.id);
            response.status(200).json({ status: "success", account: account, tokens: tokens });
            return next();
        } catch (err: any) {
            logger.warn(err);
            response.status(400).json({ status: "error", error: err });
            return next();
        }
    }

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
            if (!data.identifier) throw new InvalidInputError('identifier');
            if (!data.password) throw new InvalidInputError('password');
            // Fetch account and verify it exists
            const account = await findAccountByEmail(data.identifier);
            if (account == undefined) throw Error("Invalid credentials provided");
            // Compare password
            const result = await bcrypt.compare(data.password, account.password);
            if (!result) throw Error("Invalid credentials provided");
            // Create jwt and return to user
            const tokens = generateTokenPair(account.id);
            response.status(200).json({ status: "success", account: account, tokens: tokens });
            return next();
        } catch (err: any) {
            logger.warn(err);
            response.status(400).json({ status: "error", error: err });
            return next(err);
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
            response.status(200).json({ status: "success", tokens: { access: token }});
            return next();
        } catch (err: any) {
            logger.warn(err);
            response.status(406).json({ status: "error", error: err });
            return next(err);
        }
    }
}
