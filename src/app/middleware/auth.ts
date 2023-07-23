import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { findAccount } from "../services/accounts.service";
import { InvalidInputError, ConfigurationError, UnauthorizedError } from "../../domain/error";

const SECRET = process.env.API_ACCESS_SECRET ?? undefined;

/**
 * This middleware function authenticated the request via a access token.
 * @param request Http request
 * @param response Http response
 * @param next Next middleware function
 * @returns Result of next middleware function, or bad request response
 */
export const authenticate = async (request: Request, response: Response, next: NextFunction) => {
    try {
        if (SECRET == undefined) throw new ConfigurationError("Missing environment variable: API_ACCESS_SECRET");
        if (!request.headers.authorization) throw new UnauthorizedError("Missing authentication token");
        const token = parseBearerToken(request.headers.authorization);
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err || !decoded || typeof decoded == "string") {
                throw new UnauthorizedError("Invalid or malformed token provided");
            } else {
                const account = await findAccount(request.ip, decoded.id);
                if (!account) throw new UnauthorizedError(`Account no longer exists: ${decoded.id}`);
                request.user = { uid: account.uid };
            }
        });
        next();
    } catch (err: any) {
        next(err);
    }
}

/**
 * This helper function extracts the bearer token from an authorization string
 * @param authString Authorization string containing a bearer token
 * @returns The parsed bearer token
 */
const parseBearerToken = (authString: string) => {
    const token = authString.split(' ')[1];
    if (token == undefined) throw new InvalidInputError("Access Token");
    return token;
}
