import jwt from "jsonwebtoken";
import { ConfigurationError, UnauthorizedError } from "../config/error";

const ACCESS_SECRET = process.env.API_ACCESS_SECRET ?? undefined;
const REFRESH_SECRET = process.env.API_REFRESH_SECRET ?? undefined;
const ACCESS_EXP = process.env.API_ACCESS_EXP ?? undefined;
const REFRESH_EXP = process.env.API_REFRESH_EXP ?? undefined;

export const generateTokenPair = (accountId: string) => {
    return {
        access: generateAccessToken(accountId),
        refresh: generateRefreshToken(accountId)
    };
}

export const generateAccessToken = (accountId: string) => {
    if (ACCESS_SECRET == undefined) throw new ConfigurationError("Missing environment variable: ACCESS_SECRET");
    if (ACCESS_EXP == undefined) throw new ConfigurationError("Missing environment variable: ACCESS_EXP");
    return jwt.sign({ id: accountId, tokenType: 'access' }, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

export const generateRefreshToken = (accountId: string) => {
    if (REFRESH_SECRET == undefined) throw new ConfigurationError("Missing environment variable: REFRESH_SECRET");
    if (REFRESH_EXP == undefined) throw new ConfigurationError("Missing environment variable: REFRESH_EXP");
    return jwt.sign({ id: accountId, tokenType: 'access' }, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

export const refreshAccessToken = (refreshToken: string) => {
    if (REFRESH_SECRET == undefined) throw new ConfigurationError("Missing environment variable: REFRESH_SECRET");
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    if (!decoded || typeof decoded == "string") throw new UnauthorizedError("Invalid or malformed token provided");
    return generateAccessToken(decoded.id);
}
