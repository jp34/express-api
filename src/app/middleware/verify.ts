import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../domain/error";

export const verify = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const remoteIp = request.header("x-real-ip") || request.connection.remoteAddress;
        if (!remoteIp) throw new UnauthorizedError("Unable to parse ip from request header");
        request.ip = remoteIp;
        next();
    } catch (err: any) {
        next(err);
    }
}
