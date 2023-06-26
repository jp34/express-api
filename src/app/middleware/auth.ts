import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { InvalidInputError, ConfigurationError } from "../models/error";

const SECRET = process.env.API_ACCESS_SECRET ?? undefined;

/**
 * This middleware function authorizes the request via a access token.
 * @param request Http request
 * @param response Http response
 * @param next Next middleware function
 * @returns Result of next middleware function, or bad request response
 */
export const authorize = async (request: Request, response: Response, next: NextFunction) => {
    if (SECRET == undefined) throw new ConfigurationError("Missing environment variable: API_ACCESS_SECRET");
    if (!request.headers.authorization) throw new InvalidInputError("Missing authorization token: Bearer");
    const token = parseBearerToken(request.headers.authorization);
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err || !decoded || typeof decoded == "string") {
            response.status(406).json({ error: "Invalid or malformed access token provided"});
        } else {
            request.user = { id: decoded.id };
        }
    });
    next();
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
