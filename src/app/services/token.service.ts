import jwt from "jsonwebtoken";
import { ConfigurationError, UnauthorizedError } from "../../domain/error";

const API_ACCESS_SECRET = process.env.API_ACCESS_SECRET ?? undefined;
const API_REFRESH_SECRET = process.env.API_REFRESH_SECRET ?? undefined;
const API_ACCESS_EXP = process.env.API_ACCESS_EXP ?? undefined;
const API_REFRESH_EXP = process.env.API_REFRESH_EXP ?? undefined;

export const generateTokenPair = (accountId: string) => {
    return {
        access: generateAccessToken(accountId),
        refresh: generateRefreshToken(accountId)
    };
}

export const generateAccessToken = (accountId: string) => {
    if (API_ACCESS_SECRET == undefined) throw new ConfigurationError("Missing environment variable: API_ACCESS_SECRET");
    if (API_ACCESS_EXP == undefined) throw new ConfigurationError("Missing environment variable: API_ACCESS_EXP");
    return jwt.sign({ id: accountId, tokenType: 'access' }, API_ACCESS_SECRET, { expiresIn: API_ACCESS_EXP });
}

export const generateRefreshToken = (accountId: string) => {
    if (API_REFRESH_SECRET == undefined) throw new ConfigurationError("Missing environment variable: API_REFRESH_SECRET");
    if (API_REFRESH_EXP == undefined) throw new ConfigurationError("Missing environment variable: API_REFRESH_EXP");
    return jwt.sign({ id: accountId, tokenType: 'access' }, API_REFRESH_SECRET, { expiresIn: API_REFRESH_EXP });
}

export const refreshAccessToken = (refreshToken: string) => {
    if (API_REFRESH_SECRET == undefined) throw new ConfigurationError("Missing environment variable: API_REFRESH_SECRET");
    const decoded = jwt.verify(refreshToken, API_REFRESH_SECRET);
    if (!decoded || typeof decoded == "string") throw new UnauthorizedError("Invalid or malformed token provided");
    return generateAccessToken(decoded.id);
}
